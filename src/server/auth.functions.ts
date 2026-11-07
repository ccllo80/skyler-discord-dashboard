import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { canManageGuild } from "@/lib/discord-permissions";
import type { BotStatus, GuildSummary, PublicUser } from "@/lib/auth-types";

async function loadSession() {
  const { getDiscordConfig } = await import("./discord/config");
  const { unsealSession, readCookie, SESSION_COOKIE } = await import("./discord/session");
  const cfg = getDiscordConfig();
  if (!cfg.ok) return { cfg, session: null };
  const session = await unsealSession(readCookie(getRequest(), SESSION_COOKIE), cfg.config.sessionSecret);
  return { cfg, session };
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ configured: boolean; user: PublicUser | null }> => {
    const { cfg, session } = await loadSession();
    return { configured: cfg.ok, user: session?.user ?? null };
  },
);

export const getConfigStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getDiscordConfig } = await import("./discord/config");
  const cfg = getDiscordConfig();
  return { configured: cfg.ok, missing: cfg.ok ? [] : cfg.missing };
});

async function manageableGuilds(): Promise<GuildSummary[]> {
  const { cfg, session } = await loadSession();
  if (!cfg.ok || !session) throw new Error("UNAUTHENTICATED");
  const { fetchUserGuilds, fetchBotGuildIds } = await import("./discord/oauth");
  const [guilds, botIds] = await Promise.all([
    fetchUserGuilds(session.accessToken),
    fetchBotGuildIds(cfg.config.botToken),
  ]);
  return guilds.filter(canManageGuild).map((g) => {
    const botStatus: BotStatus = botIds === null ? "unknown" : botIds.has(g.id) ? "present" : "absent";
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
