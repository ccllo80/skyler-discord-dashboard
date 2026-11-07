import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const s = await import("@/server/discord/session");
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) {
          return new Response("Forbidden", { status: 403 });
        }
        const res = s.redirectTo("/", [s.cookie(s.SESSION_COOKIE, "", 0)]);
        return new Response(null, { status: 303, headers: res.headers });
      },
    },
  },
});
