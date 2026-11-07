import { createFileRoute } from "@tanstack/react-router";

// POST-only logout with same-origin check (CSRF): requires a matching Origin or Sec-Fetch-Site: same-origin.
export const Route = createFileRoute("/api/public/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const s = await import("@/server/discord/session");
        const origin = request.headers.get("origin");
        const site = request.headers.get("sec-fetch-site");
        const sameOrigin = origin ? origin === new URL(request.url).origin : site === "same-origin";
        if (!sameOrigin) return new Response("Forbidden", { status: 403 });
        return s.redirectTo("/", [s.cookie(s.SESSION_COOKIE, "", 0)], 303);
      },
    },
  },
});
