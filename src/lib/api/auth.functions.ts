import { createServerFn } from "@tanstack/react-start";
import { getRequest, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";

import { canManageGuild } from "@/lib/discord-permissions";
import { buildDiscordRedirectUris } from "@/lib/discord-setup";
import type { BotStatus, GuildSummary, PublicUser } from "@/lib/auth-types";

// Only public user fields and guild summaries are returned; the access token never leaves the server.
async function loadSession() {
  const { getDiscordConfig } = await import("@/server/discord/config");
  const { unsealSession, readCookie, SESSION_COOKIE } = await import("@/server/discord/session");
  const cfg = getDiscordConfig();
  if (!cfg.ok) return { cfg, session: null };
  const session = await unsealSession(
    readCookie(getRequest(), SESSION_COOKIE),
    cfg.config.sessionSecret,
  );
  return { cfg, session };
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ configured: boolean; user: PublicUser | null }> => {
    const { cfg, session } = await loadSession();
    return { configured: cfg.ok, user: session?.user ?? null };
  },
);

export const getConfigStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getDiscordConfig, DISCORD_REQUIRED_ENV_VARS } = await import(
    "@/server/discord/config"
  );
  const cfg = getDiscordConfig();
  return {
    configured: cfg.ok,
    missing: cfg.ok ? [] : cfg.missing,
    required: [...DISCORD_REQUIRED_ENV_VARS],
    redirectUris: buildDiscordRedirectUris(new URL(getRequest().url).origin),
  };
});

/** Verifies (once) the sealed proof set by a successful invite callback. */
export const consumeInviteSuccess = createServerFn({ method: "GET" }).handler(async () => {
  const { getDiscordConfig } = await import("@/server/discord/config");
  const s = await import("@/server/discord/session");
  const cfg = getDiscordConfig();
  if (!cfg.ok) return { ok: false };
  const proof = await s.unseal<{ exp: number }>(
    s.readCookie(getRequest(), s.INVITE_OK_COOKIE),
    cfg.config.sessionSecret,
    "invite_ok",
  );
  deleteCookie(s.INVITE_OK_COOKIE, { path: "/", httpOnly: true, secure: true, sameSite: "lax" });
  return { ok: !!proof && typeof proof.exp === "number" && proof.exp > Date.now() };
});

async function manageableGuilds(): Promise<GuildSummary[]> {
  const { cfg, session } = await loadSession();
  if (!cfg.ok || !session) throw new Error("UNAUTHENTICATED");
  const { fetchUserGuilds, fetchBotGuildIds, DiscordApiError } =
    await import("@/server/discord/oauth");
  let guilds;
  try {
    guilds = await fetchUserGuilds(session.accessToken);
  } catch (e) {
    if (e instanceof DiscordApiError && e.status === 401) throw new Error("UNAUTHENTICATED");
    throw new Error("DISCORD_UNAVAILABLE");
  }
  const manageable = guilds.filter(canManageGuild);
  const botIds = manageable.length ? await fetchBotGuildIds(cfg.config.botToken) : null;
  return manageable.map((g) => {
    const botStatus: BotStatus =
      botIds === null ? "unknown" : botIds.has(g.id) ? "present" : "absent";
    return { id: g.id, name: g.name, icon: g.icon, botStatus };
  });
}

export const getManageableGuilds = createServerFn({ method: "GET" }).handler(manageableGuilds);

export const getGuildAccess = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ guildId: z.string().regex(/^\d{5,25}$/) }).parse(d))
  .handler(async ({ data }) => {
    const guild = (await manageableGuilds()).find((g) => g.id === data.guildId);
    if (!guild) throw new Error("FORBIDDEN");
    return guild;
  });
