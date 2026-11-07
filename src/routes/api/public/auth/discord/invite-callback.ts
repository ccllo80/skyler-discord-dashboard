import { createFileRoute } from "@tanstack/react-router";

// Bot install callback: success only after a valid state AND a successful server-side code exchange.
export const Route = createFileRoute("/api/public/auth/discord/invite-callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const s = await import("@/server/discord/session");
        const { exchangeCode } = await import("@/server/discord/oauth");
        const clearState = s.clearStateCookie("invite");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return s.redirectTo("/setup?flow=invite", [clearState]);

        const url = new URL(request.url);
        const state = url.searchParams.get("state");
        const expected = s.readCookie(request, s.STATE_COOKIES.invite);
        if (!s.isValidState(expected, state))
          return s.redirectTo("/auth/error?reason=state", [clearState]);
        if (url.searchParams.get("error"))
          return s.redirectTo("/auth/error?reason=denied", [clearState]);
        const code = url.searchParams.get("code");
        if (!code) return s.redirectTo("/auth/error?reason=state", [clearState]);

        try {
          await exchangeCode(cfg.config, code, cfg.config.inviteRedirectUri);
          // Short-lived sealed proof consumed by /invite/success; the token itself is discarded.
          const proof = await s.seal(
            { exp: Date.now() + 120_000 },
            cfg.config.sessionSecret,
            "invite_ok",
          );
          return s.redirectTo("/invite/success", [
            clearState,
            s.cookie(s.INVITE_OK_COOKIE, proof, 120),
          ]);
        } catch (e) {
          console.error("invite callback failed", e instanceof Error ? e.message : e);
          return s.redirectTo("/auth/error?reason=exchange", [clearState]);
        }
      },
    },
  },
});
