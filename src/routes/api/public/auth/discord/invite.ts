import { createFileRoute } from "@tanstack/react-router";

// Starts the bot install flow (bot + applications.commands with configured permissions).
export const Route = createFileRoute("/api/public/auth/discord/invite")({
  server: {
    handlers: {
      GET: async () => {
        const { getDiscordConfig } = await import("@/server/discord/config");
        const s = await import("@/server/discord/session");
        const { inviteAuthorizeUrl } = await import("@/server/discord/oauth");
        const cfg = getDiscordConfig();
        if (!cfg.ok) return s.redirectTo("/setup?flow=invite");
        const state = s.randomState();
        return s.redirectTo(inviteAuthorizeUrl(cfg.config, state), [
          s.stateCookie("invite", state),
        ]);
      },
    },
  },
});
