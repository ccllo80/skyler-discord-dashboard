import type { WelcomePayload, WelcomeSettings } from "@/lib/welcome";
import { requestBotApi } from "./api";

const guildPath = (guildId: string) =>
  `api/v1/guilds/${encodeURIComponent(guildId)}/welcome`;

export function getWelcomeSettings(guildId: string) {
  return requestBotApi<WelcomePayload>(guildPath(guildId));
}

export function saveWelcomeSettings(guildId: string, settings: WelcomeSettings) {
  return requestBotApi<{ settings: WelcomeSettings }>(guildPath(guildId), {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export function sendWelcomeTest(guildId: string, kind: "welcome" | "leave") {
  return requestBotApi<{ sent: boolean }>(`${guildPath(guildId)}/test`, {
    method: "POST",
    body: JSON.stringify({ kind }),
  });
}
