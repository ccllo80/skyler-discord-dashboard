import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { PageShell, StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { getConfigStatus } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/setup")({
  validateSearch: (s: Record<string, unknown>) => ({
    flow: s["flow"] === "invite" ? ("invite" as const) : ("login" as const),
  }),
  loader: () => getConfigStatus(),
  head: () => ({
    meta: [
      { title: "الإعداد مطلوب — SKYLER" },
      { name: "description", content: "يلزم إكمال إعداد ربط ديسكورد قبل استخدام هذه الميزة." },
      { property: "og:title", content: "الإعداد مطلوب — SKYLER" },
      { property: "og:description", content: "يلزم إكمال إعداد ربط ديسكورد." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const { flow } = Route.useSearch();
  const { configured, missing } = Route.useLoaderData();
  const label = flow === "invite" ? "إضافة البوت" : "تسجيل الدخول";
  return (
    <PageShell>
      <StatePanel
        tone="warning"
        icon={<Settings2 />}
        title={configured ? "اكتمل الإعداد" : "الإعداد مطلوب"}
        actions={
          <Button asChild variant="heroOutline">
            <Link to="/">العودة إلى الرئيسية</Link>
          </Button>
        }
      >
        {configured ? (
          <p>اكتمل إعداد ربط ديسكورد، ويمكنك الآن المتابعة من الصفحة الرئيسية.</p>
        ) : (
          <>
            <p>
              لا يمكن بدء «{label}» حالياً، لأن إعداد ربط ديسكورد على الخادم لم يكتمل بعد. يُرجى من
              مسؤول الموقع إضافة القيم التالية:
            </p>
            <ul dir="ltr" className="mt-4 space-y-1.5 text-left">
              {missing.map((m) => (
                <li
                  key={m}
                  className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-foreground"
                >
                  {m}
                </li>
              ))}
            </ul>
          </>
        )}
      </StatePanel>
    </PageShell>
  );
}
