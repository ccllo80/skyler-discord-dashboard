import { createFileRoute } from "@tanstack/react-router";

// Bot install callback: only a validated state + successful server-side code exchange counts as success.
export const Route = createFileRoute("/api/public/auth/discord/invite-callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const s = await import("@/server/discord/session");
        const { exchangeCode } = await import("@/server/discord/oauth");
        const clearState = s.cookie(s.STATE_COOKIE, "", 0);
        const cfg = getDiscordConfig();
        if (!cfg.ok) return s.redirectTo("/setup?flow=invite", [clearState]);

        const url = new URL(request.url);
        if (url.searchParams.get("error")) return s.redirectTo("/auth/error?reason=denied", [clearState]);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state") ?? "";
        const expected = s.readCookie(request, s.STATE_COOKIE) ?? "";
        if (!code || !expected.startsWith("invite.") || !s.safeEqual(state, expected)) {
          return s.redirectTo("/auth/error?reason=state", [clearState]);
        }
        try {
          await exchangeCode(cfg.config, code, cfg.config.inviteRedirectUri);
          return s.redirectTo("/invite/success", [clearState]);
        } catch (e) {
          console.error(e);
          return s.redirectTo("/auth/error?reason=exchange", [clearState]);
        }
      },
    },
  },
});
