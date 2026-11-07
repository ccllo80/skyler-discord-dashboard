import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { PageShell, StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";

const MESSAGES = {
  denied: "أُلغيت عملية التفويض في ديسكورد، ولم يُمنح أي إذن.",
  state: "تعذّر التحقق من صحة الطلب، وربما انتهت صلاحيته. يُرجى المحاولة مجدداً.",
  exchange: "تعذّر إكمال التفويض مع ديسكورد. يُرجى المحاولة لاحقاً.",
  unknown: "حدث خطأ غير متوقع أثناء التفويض.",
} as const;

export const Route = createFileRoute("/auth/error")({
  validateSearch: (s: Record<string, unknown>) => ({
    reason: (typeof s["reason"] === "string" && s["reason"] in MESSAGES ? s["reason"] : "unknown") as keyof typeof MESSAGES,
  }),
  head: () => ({
    meta: [
      { title: "تعذّر إكمال التفويض — SKYLER" },
      { name: "description", content: "لم تكتمل عملية التفويض مع ديسكورد." },
      { property: "og:title", content: "تعذّر إكمال التفويض — SKYLER" },
      { property: "og:description", content: "لم تكتمل عملية التفويض مع ديسكورد." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => {
    const { reason } = Route.useSearch();
    return (
      <PageShell>
        <StatePanel tone="danger" icon={<ShieldAlert />} title="تعذّر إكمال التفويض"
          actions={<Button asChild variant="hero"><Link to="/">العودة إلى الرئيسية</Link></Button>}>
          {MESSAGES[reason]}
        </StatePanel>
      </PageShell>
    );
  },
});
