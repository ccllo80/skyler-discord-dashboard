import { createFileRoute } from "@tanstack/react-router";

// Starts Discord login (identify + guilds). Falls back to the setup-required page.
export const Route = createFileRoute("/api/public/auth/discord/login")({
  server: {
    handlers: {
      GET: async () => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const { randomState, cookie, redirectTo, STATE_COOKIE } = await import("@/server/discord/session");
        const { loginAuthorizeUrl } = await import("@/server/discord/oauth");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return redirectTo("/setup?flow=login");
        const state = `login.${randomState()}`;
        return redirectTo(loginAuthorizeUrl(cfg.config, state), [cookie(STATE_COOKIE, state, 600)]);
      },
    },
  },
});
