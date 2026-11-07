// Server-only configuration boundary. Read env only inside functions (Workers inject at request time).

export interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  loginRedirectUri: string;
  inviteRedirectUri: string;
  botPermissions: string;
  sessionSecret: string;
  botToken: string | null;
  apiBaseUrl: string | null;
}

export type ConfigResult =
  | { ok: true; config: DiscordConfig }
  | { ok: false; missing: string[] };

const REQUIRED = [
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "DISCORD_REDIRECT_URI",
  "DISCORD_INVITE_REDIRECT_URI",
  "DISCORD_BOT_PERMISSIONS",
  "SESSION_SECRET",
] as const;

export function getDiscordConfig(): ConfigResult {
  const env = process.env;
  const missing = REQUIRED.filter((k) => !env[k] || env[k]!.trim() === "");
  if (env["SESSION_SECRET"] && env["SESSION_SECRET"].length < 32 && !missing.includes("SESSION_SECRET")) {
    missing.push("SESSION_SECRET");
  }
  if (missing.length) return { ok: false, missing: [...missing] };
  return {
    ok: true,
    config: {
      clientId: env["DISCORD_CLIENT_ID"]!,
      clientSecret: env["DISCORD_CLIENT_SECRET"]!,
      loginRedirectUri: env["DISCORD_REDIRECT_URI"]!,
      inviteRedirectUri: env["DISCORD_INVITE_REDIRECT_URI"]!,
      botPermissions: env["DISCORD_BOT_PERMISSIONS"]!,
      sessionSecret: env["SESSION_SECRET"]!,
      botToken: env["DISCORD_BOT_TOKEN"] || null,
      apiBaseUrl: env["SKYLER_API_BASE_URL"] || null,
    },
  };
}
