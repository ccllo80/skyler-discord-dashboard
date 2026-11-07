import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionTitle, SoonBadge } from "@/components/dashboard/dashboard-ui";
import { SYSTEMS } from "@/lib/systems";

export const Route = createFileRoute("/dashboard/$guildId/")({
  component: Overview,
});

function Overview() {
  const { guildId } = Route.useParams();
  return (
    <div>
      <SectionTitle title="أنظمة الخادم">الأنظمة قيد التطوير، وستُفعَّل إعداداتها عند اكتمال الربط مع البوت.</SectionTitle>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SYSTEMS.map(({ slug, name, description, icon: Icon }) => (
          <li key={slug}>
            <Link to="/dashboard/$guildId/$system" params={{ guildId, system: slug }}
              className="flex h-full flex-col rounded-xl border border-border bg-panel p-5 transition-[transform,border-color] hover:border-glow/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-lg bg-muted"><Icon className="size-4" aria-hidden /></span>
                <SoonBadge />
              </div>
              <h2 className="mt-4 font-semibold">{name}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
