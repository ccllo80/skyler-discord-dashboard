import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api/auth.functions";

// Protected layout: the session is verified server-side (encrypted HttpOnly cookie).
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { configured, user } = await getCurrentUser();
    if (!configured) throw redirect({ to: "/setup", search: { flow: "login" } });
    if (!user) throw redirect({ to: "/sign-in" });
    return { user };
  },
  head: () => ({
    meta: [
      { title: "لوحة التحكم — SKYLER" },
      { name: "description", content: "لوحة تحكم SKYLER لإدارة خوادم ديسكورد." },
      { property: "og:title", content: "لوحة التحكم — SKYLER" },
      { property: "og:description", content: "لوحة تحكم SKYLER لإدارة خوادم ديسكورد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user } = Route.useRouteContext();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        right={
          <div className="flex min-w-0 items-center gap-3">
            <span dir="auto" className="hidden max-w-40 truncate text-sm text-muted-foreground md:inline">
              {user.globalName ?? user.username}
            </span>
            <form method="post" action="/api/public/auth/logout">
              <Button type="submit" variant="heroOutline" size="sm" className="min-h-11 md:min-h-0">
                <LogOut />
                تسجيل الخروج
              </Button>
            </form>
          </div>
        }
      />
      <main className="min-w-0 flex-1 bg-hero">
        <Outlet />
      </main>
    </div>
  );
}
