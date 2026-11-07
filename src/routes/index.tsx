import { createFileRoute } from "@tanstack/react-router";
import { Bot, LogIn, Gauge, Lock, Sparkles, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { INVITE_HREF, LOGIN_HREF, SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { SYSTEMS, STATUS_LABEL } from "@/lib/systems";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SKYLER — بوت إدارة خوادم ديسكورد" },
      { name: "description", content: "SKYLER بوت لإدارة خوادم ديسكورد: الترحيب والمستويات والإشراف والسجلات من لوحة تحكم واحدة." },
      { property: "og:title", content: "SKYLER — بوت إدارة خوادم ديسكورد" },
      { property: "og:description", content: "أدر خادمك في ديسكورد بأدوات دقيقة ولوحة تحكم واحدة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Gauge, title: "أداء مستقر", text: "استجابة سريعة وموثوقة حتى في الخوادم الكبيرة." },
  { icon: Lock, title: "صلاحيات محكمة", text: "يُتحقق من صلاحياتك في الخادم قبل أي إجراء." },
  { icon: Layers, title: "لوحة تحكم موحدة", text: "جميع الأنظمة في مكان واحد بتنظيم واضح." },
  { icon: Sparkles, title: "تجربة عربية أصيلة", text: "واجهة مصممة للعربية من البداية." },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-hero">
          <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-20 text-center sm:pt-28">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted-foreground animate-in fade-in duration-500">
              <span className="size-1.5 rounded-full bg-glow" aria-hidden />
              بوت إدارة خوادم ديسكورد
            </span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl animate-in fade-in slide-in-from-bottom-3 duration-700">
              <span dir="ltr" className="text-silver">SKYLER</span>
              <span className="mt-3 block text-2xl font-bold text-foreground/90 sm:text-4xl">إدارة خادمك بدقة وهدوء</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg animate-in fade-in duration-1000">
              يجمع SKYLER أدوات الترحيب والمستويات والإشراف والسجلات وغيرها في بوت واحد ولوحة تحكم واضحة، لتدير مجتمعك بثقة.
            </p>
            <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-xl sm:flex-row">
              <Button asChild variant="hero" size="xl" className="flex-1">
                <a href={INVITE_HREF}><Bot />إضافة البوت</a>
              </Button>
              <Button asChild variant="heroOutline" size="xl" className="flex-1">
                <a href={LOGIN_HREF}><LogIn />تسجيل الدخول</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 id="features-title" className="text-center text-2xl font-bold sm:text-3xl">لماذا SKYLER؟</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-panel p-6 transition-colors hover:border-glow/30">
                <Icon className="size-5 text-glow" aria-hidden />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="systems" aria-labelledby="systems-title" className="scroll-mt-20 border-t border-border/60 bg-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <h2 id="systems-title" className="text-2xl font-bold sm:text-3xl">ثمانية أنظمة في لوحة واحدة</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">تُطرح الأنظمة تباعاً، وستتمكن من ضبطها لكل خادم على حدة.</p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SYSTEMS.map(({ slug, name, description, icon: Icon, status }) => (
                <li key={slug} className="flex flex-col rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-foreground"><Icon className="size-4" aria-hidden /></span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{STATUS_LABEL[status]}</span>
                  </div>
                  <h3 className="mt-4 font-semibold">{name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
