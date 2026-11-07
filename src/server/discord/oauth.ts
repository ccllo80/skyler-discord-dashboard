import type { DiscordConfig } from "./config";

const DISCORD = "https://discord.com";
const API = "https://discord.com/api/v10";

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

export async function exchangeCode(c: DiscordConfig, code: string, redirectUri: string) {
  const res = await fetch(`${API}/oauth2/token`, {
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
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  return (await res.json()) as { access_token: string; expires_in: number; scope: string };
}

export interface DiscordUser { id: string; username: string; global_name: string | null; avatar: string | null }
export interface DiscordPartialGuild { id: string; name: string; icon: string | null; owner: boolean; permissions: string }

export async function fetchUser(token: string) {
  const res = await fetch(`${API}/users/@me`, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`user fetch failed: ${res.status}`);
  return (await res.json()) as DiscordUser;
}

export async function fetchUserGuilds(token: string) {
  const res = await fetch(`${API}/users/@me/guilds`, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`guilds fetch failed: ${res.status}`);
  return (await res.json()) as DiscordPartialGuild[];
}

/** Guild IDs the bot is in. Returns null when no bot token is configured. */
export async function fetchBotGuildIds(botToken: string | null): Promise<Set<string> | null> {
  if (!botToken) return null;
  const ids = new Set<string>();
  let after = "0";
  for (let i = 0; i < 10; i++) {
    const res = await fetch(`${API}/users/@me/guilds?limit=200&after=${after}`, {
      headers: { authorization: `Bot ${botToken}` },
    });
    if (!res.ok) return null;
    const page = (await res.json()) as { id: string }[];
    page.forEach((g) => ids.add(g.id));
    if (page.length < 200) break;
    after = page[page.length - 1].id;
  }
  return ids;
}
