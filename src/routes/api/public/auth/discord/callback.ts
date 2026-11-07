import { createFileRoute } from "@tanstack/react-router";

// Login callback: validates state, exchanges the code server-side, sets an encrypted HttpOnly session.
export const Route = createFileRoute("/api/public/auth/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const s = await import("@/server/discord/session");
        const { exchangeCode, fetchUser } = await import("@/server/discord/oauth");
        const clearState = s.cookie(s.STATE_COOKIE, "", 0);
        const cfg = getDiscordConfig();
        if (!cfg.ok) return s.redirectTo("/setup?flow=login", [clearState]);

        const url = new URL(request.url);
        if (url.searchParams.get("error")) return s.redirectTo("/auth/error?reason=denied", [clearState]);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state") ?? "";
        const expected = s.readCookie(request, s.STATE_COOKIE) ?? "";
        if (!code || !expected.startsWith("login.") || !s.safeEqual(state, expected)) {
          return s.redirectTo("/auth/error?reason=state", [clearState]);
        }
        try {
          const token = await exchangeCode(cfg.config, code, cfg.config.loginRedirectUri);
          const user = await fetchUser(token.access_token);
          const maxAge = Math.min(token.expires_in, 60 * 60 * 24 * 7);
          const sealed = await s.sealSession(
            {
              accessToken: token.access_token,
              expiresAt: Date.now() + maxAge * 1000,
              user: { id: user.id, username: user.username, globalName: user.global_name, avatar: user.avatar },
            },
            cfg.config.sessionSecret,
          );
          return s.redirectTo("/dashboard", [clearState, s.cookie(s.SESSION_COOKIE, sealed, maxAge)]);
        } catch (e) {
          console.error(e);
          return s.redirectTo("/auth/error?reason=exchange", [clearState]);
        }
      },
    },
  },
});
