import { createFileRoute } from "@tanstack/react-router";

// Starts Discord login (identify + guilds). Falls back to the setup-required page.
export const Route = createFileRoute("/api/public/auth/discord/login")({
  server: {
    handlers: {
      GET: async () => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const s = await import("@/server/discord/session");
        const { loginAuthorizeUrl } = await import("@/server/discord/oauth");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return s.redirectTo("/setup?flow=login");
        const state = s.randomState();
        return s.redirectTo(loginAuthorizeUrl(cfg.config, state), [s.stateCookie("login", state)]);
      },
    },
  },
});
