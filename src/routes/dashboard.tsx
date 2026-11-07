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
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.globalName ?? user.username}</span>
            <form method="post" action="/api/public/auth/logout">
              <Button type="submit" variant="heroOutline" size="sm"><LogOut />تسجيل الخروج</Button>
            </form>
          </div>
        }
      />
      <main className="flex-1 bg-hero">
        <Outlet />
      </main>
    </div>
  );
}
