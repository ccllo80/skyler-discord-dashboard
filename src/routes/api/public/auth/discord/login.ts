import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/auth/discord/login")({
  server: {
    handlers: {
      GET: async () => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const { randomState, cookie, STATE_COOKIE } = await import("@/server/discord/session");
        const { loginAuthorizeUrl } = await import("@/server/discord/oauth");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return Response.redirect(new URL("/setup?flow=login", "http://x").pathname + "?flow=login", 302);
        const state = `login.${randomState()}`;
        return new Response(null, {
          status: 302,
          headers: {
            location: loginAuthorizeUrl(cfg.config, state),
            "set-cookie": cookie(STATE_COOKIE, state, 600),
          },
        });
      },
    },
  },
});
