import type { DiscordConfig } from "./config";

const DISCORD = "https://discord.com";
const API = "https://discord.com/api/v10";
const PAGE = 200;
/** Safety bound only; reaching it is treated as an error, never as "absent". */
const MAX_PAGES = 1000;

export class DiscordApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function loginAuthorizeUrl(c: DiscordConfig, state: string) {
  const p = new URLSearchParams({
    client_id: c.clientId,
    response_type: "code",
    redirect_uri: c.loginRedirectUri,
    scope: "identify guilds",
    state,
    prompt: "consent",
  });
  return `${DISCORD}/oauth2/authorize?${p}`;
}

export function inviteAuthorizeUrl(c: DiscordConfig, state: string) {
  const p = new URLSearchParams({
    client_id: c.clientId,
    response_type: "code",
    redirect_uri: c.inviteRedirectUri,
    scope: "bot applications.commands",
    permissions: c.botPermissions,
    state,
  });
  return `${DISCORD}/oauth2/authorize?${p}`;
}

/** fetch with one bounded retry on 429 (Discord rate limit). */
async function discordFetch(
  url: string,
  init: RequestInit,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetchImpl(url, init);
    if (res.status !== 429) return res;
    const body = (await res.json().catch(() => ({}))) as { retry_after?: number };
    const wait = Number(body.retry_after ?? res.headers.get("retry-after") ?? 1);
    if (!Number.isFinite(wait) || wait > 5) throw new DiscordApiError(429, "rate limited");
    await new Promise((r) => setTimeout(r, Math.ceil(wait * 1000)));
  }
  throw new DiscordApiError(429, "rate limited");
}

export async function exchangeCode(c: DiscordConfig, code: string, redirectUri: string) {
  const res = await discordFetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: c.clientId,
      client_secret: c.clientSecret,
    }),
  });
  if (!res.ok) throw new DiscordApiError(res.status, "token exchange failed");
  const json = (await res.json()) as { access_token?: string; expires_in?: number; scope?: string };
  if (!json.access_token || typeof json.expires_in !== "number")
    throw new DiscordApiError(502, "malformed token response");
  return { access_token: json.access_token, expires_in: json.expires_in, scope: json.scope ?? "" };
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}
export interface DiscordPartialGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export async function fetchUser(token: string) {
  const res = await discordFetch(`${API}/users/@me`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new DiscordApiError(res.status, "user fetch failed");
  return (await res.json()) as DiscordUser;
}

/** Fetches every page of /users/@me/guilds (Discord caps each page at 200). */
export async function fetchAllGuilds<T extends { id: string }>(
  authorization: string,
  fetchImpl: typeof fetch = fetch,
): Promise<T[]> {
  const all: T[] = [];
  let after = "0";
  for (let i = 0; i < MAX_PAGES; i++) {
    const res = await discordFetch(
      `${API}/users/@me/guilds?limit=${PAGE}&after=${after}`,
      { headers: { authorization } },
      fetchImpl,
    );
    if (!res.ok) throw new DiscordApiError(res.status, "guilds fetch failed");
    const page = (await res.json()) as T[];
    if (!Array.isArray(page)) throw new DiscordApiError(502, "malformed guilds response");
    all.push(...page);
    if (page.length < PAGE) return all;
    after = page[page.length - 1]!.id;
  }
  throw new DiscordApiError(502, "guild pagination exceeded safety bound");
}

export function fetchUserGuilds(token: string) {
  return fetchAllGuilds<DiscordPartialGuild>(`Bearer ${token}`);
}

/** Guild IDs the bot is in, or null when unknown (no token or any failure) — never a false "absent". */
export async function fetchBotGuildIds(botToken: string | null): Promise<Set<string> | null> {
  if (!botToken) return null;
  try {
    const guilds = await fetchAllGuilds<{ id: string }>(`Bot ${botToken}`);
    return new Set(guilds.map((g) => g.id));
  } catch (e) {
    console.error("bot guilds unavailable", e);
    return null;
  }
}
