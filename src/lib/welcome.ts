export interface WelcomeSettings {
  welcomeEnabled: boolean;
  welcomeChannelId: string | null;
  welcomeMessage: string;
  leaveEnabled: boolean;
  leaveChannelId: string | null;
  leaveMessage: string;
}

export interface WelcomeChannel {
  id: string;
  name: string;
}

export interface WelcomePayload {
  settings: WelcomeSettings;
  channels: WelcomeChannel[];
}

export type BotApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "unavailable" | "rejected"; message: string };

export const DEFAULT_WELCOME_SETTINGS: WelcomeSettings = {
  welcomeEnabled: false,
  welcomeChannelId: null,
  welcomeMessage: "أهلاً {user} بك في **{server}**! أنت العضو رقم **{memberCount}**.",
  leaveEnabled: false,
  leaveChannelId: null,
  leaveMessage: "غادر **{username}** الخادم. نتمنى له التوفيق.",
};

export function previewWelcomeMessage(template: string): string {
  return template
    .replaceAll("{user}", "@عضو جديد")
    .replaceAll("{username}", "عضو جديد")
    .replaceAll("{server}", "خادم SKYLER")
    .replaceAll("{memberCount}", "125")
    .replaceAll("{userId}", "123456789012345678")
    .replaceAll("{serverId}", "987654321098765432");
}
