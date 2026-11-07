import { createFileRoute } from "@tanstack/react-router";

// Login callback: strict state check, server-side code exchange, encrypted HttpOnly session.
export const Route = createFileRoute("/api/public/auth/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const s = await import("@/server/discord/session");
        const { exchangeCode, fetchUser } = await import("@/server/discord/oauth");
        const clearState = s.clearStateCookie("login");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return s.redirectTo("/setup?flow=login", [clearState]);

        const url = new URL(request.url);
        const state = url.searchParams.get("state");
        const expected = s.readCookie(request, s.STATE_COOKIES.login);
        if (!s.isValidState(expected, state)) return s.redirectTo("/auth/error?reason=state", [clearState]);
        if (url.searchParams.get("error")) return s.redirectTo("/auth/error?reason=denied", [clearState]);
        const code = url.searchParams.get("code");
        if (!code) return s.redirectTo("/auth/error?reason=state", [clearState]);

        try {
          const token = await exchangeCode(cfg.config, code, cfg.config.loginRedirectUri);
          if (!token.scope.split(" ").includes("guilds")) throw new Error("guilds scope not granted");
          const user = await fetchUser(token.access_token);
          const maxAge = Math.max(60, Math.min(token.expires_in, s.SESSION_MAX_AGE));
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
          console.error("login callback failed", e instanceof Error ? e.message : e);
          return s.redirectTo("/auth/error?reason=exchange", [clearState]);
        }
      },
    },
  },
});
