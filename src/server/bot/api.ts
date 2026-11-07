// Bot API integration boundary (server-only). Not wired yet: no endpoints or data are invented.
import { getDiscordConfig } from "../discord/config";

export type BotApiResult<T> = { ok: true; data: T } | { ok: false; reason: "not_configured" | "not_implemented" };

export function getBotApiBaseUrl(): string | null {
  const cfg = getDiscordConfig();
  return cfg.ok ? cfg.config.apiBaseUrl : null;
}

/** Placeholder for fetching a system's settings once the bot API exists. */
export async function getSystemSettings(_guildId: string, _system: string): Promise<BotApiResult<never>> {
  if (!getBotApiBaseUrl()) return { ok: false, reason: "not_configured" };
  return { ok: false, reason: "not_implemented" };
}
