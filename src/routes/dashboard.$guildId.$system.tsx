import { createFileRoute, notFound } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { SectionTitle, SoonBadge } from "@/components/dashboard/dashboard-ui";
import { WelcomeSettingsPage } from "@/components/dashboard/systems/welcome-settings";
import { StatePanel } from "@/components/site/site-chrome";
import { getWelcomeSettings } from "@/lib/api/welcome.functions";
import { findSystem } from "@/lib/systems";

export const Route = createFileRoute("/dashboard/$guildId/$system")({
  loader: async ({ params }) => {
    const system = findSystem(params.system);
    if (!system) throw notFound();
    const welcome =
      system.slug === "welcome"
        ? await getWelcomeSettings({ data: { guildId: params.guildId } })
        : null;
    return { slug: system.slug, welcome };
  },
  notFoundComponent: () => (
    <StatePanel title="النظام غير موجود">لا يوجد نظام بهذا الاسم في لوحة التحكم.</StatePanel>
  ),
  head: ({ loaderData }) => {
    const system = findSystem(loaderData?.slug ?? "");
    const name = system?.name ?? "النظام غير موجود";
    const description =
      system?.status === "available"
        ? `إعدادات نظام ${name} في لوحة SKYLER.`
        : `نظام ${name} في SKYLER قيد التطوير.`;
    return {
      meta: [
        { title: `${name} — SKYLER` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — SKYLER` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: SystemPage,
});

function SystemPage() {
  const { slug, welcome } = Route.useLoaderData();
  const { guildId } = Route.useParams();
  const system = findSystem(slug);
  if (!system)
    return (
      <StatePanel title="النظام غير موجود">لا يوجد نظام بهذا الاسم في لوحة التحكم.</StatePanel>
    );

  if (slug === "welcome" && welcome) {
    return <WelcomeSettingsPage guildId={guildId} initialResult={welcome} />;
  }

  const Icon = system.icon;
  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-muted">
          <Icon className="size-5" aria-hidden />
        </span>
        <SoonBadge />
      </div>
      <SectionTitle title={system.name}>{system.description}</SectionTitle>
      <StatePanel icon={<Hourglass />} title="هذا النظام قيد التطوير">
        لم تُفعَّل إعدادات «{system.name}» بعد. ستتوفر هنا عند اكتمال تطوير النظام وربطه بالبوت.
      </StatePanel>
    </div>
  );
}
