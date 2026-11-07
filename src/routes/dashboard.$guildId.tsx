import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutGrid, ShieldX, ArrowRight } from "lucide-react";
import { BotStatusBadge, PendingState, SoonBadge } from "@/components/dashboard/dashboard-ui";
import { StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { SYSTEMS } from "@/lib/systems";
import { getGuildAccess } from "@/lib/api/auth.functions";

// Access to a guild is re-checked server-side on every load.
export const Route = createFileRoute("/dashboard/$guildId")({
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
  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const activeCls = "bg-accent text-foreground";

function GuildLayout() {
  const guild = Route.useLoaderData();
  const { guildId } = Route.useParams();
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-3.5" />
          جميع الخوادم
        </Link>
        <div className="mb-4 rounded-xl border border-border bg-panel p-4">
          <p className="truncate font-semibold">{guild.name}</p>
          <div className="mt-2">
            <BotStatusBadge status={guild.botStatus} />
          </div>
        </div>
        <nav
          aria-label="أنظمة الخادم"
          className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
        >
          <Link
            to="/dashboard/$guildId"
            params={{ guildId }}
            activeOptions={{ exact: true }}
            className={navCls}
            activeProps={{ className: activeCls }}
          >
            <LayoutGrid className="size-4" />
            نظرة عامة
          </Link>
          {SYSTEMS.map(({ slug, name, icon: Icon }) => (
            <Link
              key={slug}
              to="/dashboard/$guildId/$system"
              params={{ guildId, system: slug }}
              className={navCls}
              activeProps={{ className: activeCls }}
            >
              <Icon className="size-4" />
              <span className="flex-1">{name}</span>
              <span className="hidden lg:inline">
                <SoonBadge />
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
