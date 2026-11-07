// Public OAuth route metadata only; never add credentials or secret values here.
export const DISCORD_CALLBACK_PATHS = {
  login: "/api/public/auth/discord/callback",
  invite: "/api/public/auth/discord/invite-callback",
} as const;

export function buildDiscordRedirectUris(origin: string) {
  return {
    login: new URL(DISCORD_CALLBACK_PATHS.login, origin).toString(),
    invite: new URL(DISCORD_CALLBACK_PATHS.invite, origin).toString(),
  };
}
