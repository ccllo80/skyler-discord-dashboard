import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid, Menu, ShieldX } from "lucide-react";
import { BotStatusBadge, PendingState, SoonBadge } from "@/components/dashboard/dashboard-ui";
import { StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SYSTEMS } from "@/lib/systems";
import { getGuildAccess } from "@/lib/api/auth.functions";

// Access to a guild is re-checked server-side on every load.
export const Route = createFileRoute("/dashboard/$guildId")({
  head: () => ({
    meta: [
      { title: "إدارة الخادم — SKYLER" },
      { name: "description", content: "إدارة خادم ديسكورد وأنظمته في SKYLER." },
      { property: "og:title", content: "إدارة الخادم — SKYLER" },
      { property: "og:description", content: "لوحة أنظمة خادم ديسكورد في SKYLER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params }) => getGuildAccess({ data: { guildId: params.guildId } }),
  pendingComponent: () => <PendingState />,
  errorComponent: () => (
    <div className="px-4 py-16">
      <StatePanel
        tone="danger"
        icon={<ShieldX />}
        title="لا يمكن الوصول إلى هذا الخادم"
        actions={
          <Button asChild variant="heroOutline">
            <Link to="/dashboard">العودة إلى قائمة الخوادم</Link>
          </Button>
        }
      >
        إما أن الخادم غير موجود، أو أنك لا تملك صلاحية إدارته.
      </StatePanel>
    </div>
  ),
  component: GuildLayout,
});

const navCls =
  "flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const activeCls = "bg-accent text-foreground";

function GuildLayout() {
  const guild = Route.useLoaderData();
  const { guildId } = Route.useParams();

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
      <header className="mb-6 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/dashboard"
            aria-label="العودة إلى قائمة الخوادم"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-panel text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRight className="size-4" />
          </Link>
          <div className="min-w-0">
            <p dir="auto" className="truncate text-sm font-semibold sm:text-base">
              {guild.name}
            </p>
            <div className="mt-1">
              <BotStatusBadge status={guild.botStatus} />
            </div>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="فتح قائمة الأنظمة"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-panel text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            dir="rtl"
            className="w-[min(86vw,20rem)] overflow-y-auto border-l border-border bg-background p-5"
          >
            <SheetHeader className="mb-6 text-right sm:text-right">
              <SheetTitle>قائمة أنظمة الخادم</SheetTitle>
              <SheetDescription>انتقل إلى النظام الذي تريد إدارته.</SheetDescription>
            </SheetHeader>

            <nav aria-label="أنظمة الخادم" className="flex min-w-0 flex-col gap-1">
              <SheetClose asChild>
                <Link
                  to="/dashboard/$guildId"
                  params={{ guildId }}
                  activeOptions={{ exact: true }}
                  className={navCls}
                  activeProps={{ className: activeCls }}
                >
                  <LayoutGrid className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1">نظرة عامة</span>
                </Link>
              </SheetClose>
              {SYSTEMS.map(({ slug, name, icon: Icon }) => (
                <SheetClose asChild key={slug}>
                  <Link
                    to="/dashboard/$guildId/$system"
                    params={{ guildId, system: slug }}
                    className={navCls}
                    activeProps={{ className: activeCls }}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1">{name}</span>
                    <SoonBadge />
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
