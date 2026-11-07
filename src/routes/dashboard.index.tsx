import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ServerOff } from "lucide-react";
import { BotStatusBadge, PendingState, SectionTitle } from "@/components/dashboard/dashboard-ui";
import { StatePanel } from "@/components/site/site-chrome";
import { guildIconUrl } from "@/lib/auth-types";
import { getManageableGuilds } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/dashboard/")({
  loader: () => getManageableGuilds(),
  pendingComponent: () => <PendingState label="جارٍ تحميل الخوادم…" />,
  errorComponent: () => (
    <div className="px-4 py-16">
      <StatePanel tone="danger" icon={<ServerOff />} title="تعذّر تحميل الخوادم">
        لم نتمكن من جلب قائمة خوادمك من ديسكورد. يُرجى تحديث الصفحة أو تسجيل الدخول مجدداً.
      </StatePanel>
    </div>
  ),
  component: ServerPicker,
});

function ServerPicker() {
  const guilds = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionTitle title="اختر خادماً">تظهر هنا الخوادم التي تملك صلاحية إدارتها.</SectionTitle>
      {guilds.length === 0 ? (
        <StatePanel icon={<ServerOff />} title="لا توجد خوادم">
          لا تملك صلاحية «إدارة الخادم» في أي خادم حالياً.
        </StatePanel>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guilds.map((g) => {
            const icon = guildIconUrl(g);
            return (
              <li key={g.id}>
                <Link
                  to="/dashboard/$guildId"
                  params={{ guildId: g.id }}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-panel p-4 transition-[transform,border-color] hover:border-glow/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {icon ? (
                    <img src={icon} alt="" className="size-12 rounded-xl" loading="lazy" />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-xl bg-muted font-bold">
                      {g.name.slice(0, 1)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{g.name}</p>
                    <div className="mt-1.5">
                      <BotStatusBadge status={g.botStatus} />
                    </div>
                  </div>
                  <ChevronLeft
                    className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
