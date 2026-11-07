import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { PageShell, StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { getConfigStatus } from "@/lib/api/auth.functions";

const ENV_DESCRIPTIONS: Record<string, string> = {
  DISCORD_CLIENT_ID: "معرّف تطبيق ديسكورد.",
  DISCORD_CLIENT_SECRET: "الرمز السري لتطبيق ديسكورد؛ يجب أن يبقى في الخادم.",
  DISCORD_REDIRECT_URI: "عنوان العودة المخصص لتسجيل الدخول، كما هو موضح أدناه.",
  DISCORD_INVITE_REDIRECT_URI: "عنوان العودة المخصص لإضافة البوت، كما هو موضح أدناه.",
  DISCORD_BOT_PERMISSIONS: "رقم صلاحيات البوت الذي تنشئه أداة الصلاحيات في ديسكورد.",
  SESSION_SECRET: "نص عشوائي لا يقل عن 32 حرفاً لحماية الجلسات.",
};

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const { flow } = Route.useSearch();
  const { configured, missing, required, redirectUris } = Route.useLoaderData();
  const label = flow === "invite" ? "إضافة البوت" : "تسجيل الدخول";
  const redirects = [
    {
      name: "DISCORD_REDIRECT_URI",
      label: "عنوان العودة لتسجيل الدخول",
      uri: redirectUris.login,
    },
    {
      name: "DISCORD_INVITE_REDIRECT_URI",
      label: "عنوان العودة لإضافة البوت",
      uri: redirectUris.invite,
    },
  ];

  return (
    <PageShell>
      <StatePanel
        className="max-w-3xl p-5 sm:p-8"
        tone={configured ? "success" : "warning"}
        icon={<Settings2 />}
        title={configured ? "اكتمل الإعداد" : "الإعداد مطلوب"}
        actions={
          <Button asChild variant="heroOutline">
            <Link to="/">العودة إلى الرئيسية</Link>
          </Button>
        }
      >
        <p className="text-center">
          {configured
            ? "اكتمل إعداد ربط ديسكورد، ويمكنك الآن المتابعة من الصفحة الرئيسية."
            : `لا يمكن بدء «${label}» حالياً، لأن إعداد ربط ديسكورد على الخادم لم يكتمل بعد.`}
        </p>

        <div className="mt-7 space-y-7 text-right">
          <section aria-labelledby="required-env-title">
            <h2 id="required-env-title" className="text-base font-semibold text-foreground">
              متغيرات البيئة المطلوبة
            </h2>
            <p className="mt-1 text-xs leading-6">
              تُضاف القيم من إعدادات مشروع Lovable ضمن «الأسرار»، ولا تُعرض قيمها هنا.
            </p>
            <ul className="mt-4 space-y-2.5">
              {required.map((name) => {
                const isMissing = missing.includes(name);
                return (
                  <li key={name} className="rounded-lg border border-border/70 bg-muted/40 p-3.5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
                      <code dir="ltr" className="min-w-0 text-start font-mono text-xs font-semibold leading-5 text-foreground">
                        {name}
                      </code>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          isMissing
                            ? "bg-destructive/10 text-destructive"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {isMissing ? "مطلوب" : "مُضاف"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-6">{ENV_DESCRIPTIONS[name]}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="redirect-uris-title">
            <h2 id="redirect-uris-title" className="text-base font-semibold text-foreground">
              عناوين إعادة التوجيه
            </h2>
            <p className="mt-1 text-xs leading-6">
              سجّل العنوانين كاملين ومطابقين تماماً في إعدادات OAuth2 لتطبيق ديسكورد.
            </p>
            <div className="mt-4 space-y-4">
              {redirects.map((redirect) => (
                <div key={redirect.name}>
                  <h3 className="mb-2 text-xs font-semibold text-foreground">
                    {redirect.label} — <span dir="ltr">{redirect.name}</span>
                  </h3>
                  <code
                    dir="ltr"
                    className="block break-all rounded-lg bg-muted px-3 py-2.5 text-left font-mono text-xs leading-6 text-foreground"
                  >
                    {redirect.uri}
                  </code>
                </div>
              ))}
            </div>
          </section>

          <p className="rounded-lg border border-border/70 px-3.5 py-3 text-xs leading-6">
            لا تستخدم البادئة <span dir="ltr">VITE_</span> أو <span dir="ltr">NEXT_PUBLIC_</span>
            لهذه المتغيرات؛ فهي مخصصة للخادم فقط.
          </p>
        </div>
      </StatePanel>
    </PageShell>
  );
}
