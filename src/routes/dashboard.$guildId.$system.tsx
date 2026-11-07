import { createFileRoute, notFound } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { SectionTitle, SoonBadge } from "@/components/dashboard/dashboard-ui";
import { StatePanel } from "@/components/site/site-chrome";
import { findSystem } from "@/lib/systems";

// Page shell per system; real settings will be wired here once the bot API exists.
export const Route = createFileRoute("/dashboard/$guildId/$system")({
  loader: ({ params }) => {
    const system = findSystem(params.system);
    if (!system) throw notFound();
    return { slug: system.slug };
  },
  notFoundComponent: () => (
    <StatePanel title="النظام غير موجود">لا يوجد نظام بهذا الاسم في لوحة التحكم.</StatePanel>
  ),
  head: ({ loaderData }) => {
    const name = findSystem(loaderData?.slug ?? "")?.name ?? "النظام غير موجود";
    return { meta: [
      { title: `${name} — SKYLER` },
      { name: "description", content: `نظام ${name} في SKYLER قيد التطوير.` },
      { property: "og:title", content: `${name} — SKYLER` },
      { property: "og:description", content: `نظام ${name} في SKYLER قيد التطوير.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ] };
  },
  component: SystemPage,
});

function SystemPage() {
  const { slug } = Route.useLoaderData();
  const system = findSystem(slug);
  if (!system) return <StatePanel title="النظام غير موجود">لا يوجد نظام بهذا الاسم في لوحة التحكم.</StatePanel>;
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
        لم تُفعَّل إعدادات «{system.name}» بعد. ستتوفر هنا عند اكتمال ربط لوحة التحكم مع البوت، ولن
        يُحفظ أي إعداد قبل ذلك.
      </StatePanel>
    </div>
  );
}
