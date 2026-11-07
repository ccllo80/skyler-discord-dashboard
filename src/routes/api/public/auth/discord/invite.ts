import { createFileRoute } from "@tanstack/react-router";

// Starts the bot install flow (bot + applications.commands with configured permissions).
export const Route = createFileRoute("/api/public/auth/discord/invite")({
  server: {
    handlers: {
      GET: async () => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const { randomState, cookie, redirectTo, STATE_COOKIE } = await import("@/server/discord/session");
        const { inviteAuthorizeUrl } = await import("@/server/discord/oauth");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return redirectTo("/setup?flow=invite");
        const state = `invite.${randomState()}`;
        return redirectTo(inviteAuthorizeUrl(cfg.config, state), [cookie(STATE_COOKIE, state, 600)]);
      },
    },
  },
});
