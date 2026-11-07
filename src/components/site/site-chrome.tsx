import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LOGIN_HREF = "/api/public/auth/discord/login";
export const INVITE_HREF = "/api/public/auth/discord/invite";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label="SKYLER — الصفحة الرئيسية"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary-gradient shadow-glow">
        <svg
          viewBox="0 0 24 24"
          className="size-4 text-primary-foreground"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4Zm0 4.2 4 2v3.6c0 3-1.7 5.3-4 6.4-2.3-1.1-4-3.4-4-6.4V8.2l4-2Z" />
        </svg>
      </span>
      <span dir="ltr" className="font-display text-lg font-bold tracking-[0.2em] text-silver">
        SKYLER
      </span>
    </Link>
  );
}

export function SiteHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-1 text-sm text-muted-foreground md:flex"
        >
          <a
            href="/#features"
            className="rounded-md px-3 py-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            المزايا
          </a>
          <a
            href="/#systems"
            className="rounded-md px-3 py-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            الأنظمة
          </a>
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            لوحة التحكم
          </Link>
        </nav>
        {right ?? (
          <Button asChild variant="heroOutline" size="sm">
            <a href={LOGIN_HREF}>تسجيل الدخول</a>
          </Button>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  const soon = ["شروط الاستخدام", "سياسة الخصوصية", "مركز الدعم", "التوثيق"];
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            بوت متكامل لإدارة خوادم ديسكورد بدقة وهدوء.
          </p>
        </div>
        <nav aria-label="روابط الموقع" className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">الموقع</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                الرئيسية
              </Link>
            </li>
            <li>
              <a href="/#systems" className="hover:text-foreground">
                الأنظمة
              </a>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                لوحة التحكم
              </Link>
            </li>
          </ul>
        </nav>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">الموارد</p>
          <ul className="space-y-2 text-muted-foreground">
            {soon.map((s) => (
              <li key={s} aria-disabled className="flex items-center gap-2">
                {s}
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">قريباً</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        جميع الحقوق محفوظة © <span dir="ltr">SKYLER</span>
      </div>
    </footer>
  );
}

export function StatePanel({
  icon,
  title,
  children,
  actions,
  tone = "default",
  className,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
}) {
  const toneCls = {
    default: "text-glow",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  }[tone];
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-panel p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      {icon && (
        <div
          className={cn(
            "mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-muted [&_svg]:size-7",
            toneCls,
          )}
        >
          {icon}
        </div>
      )}
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
      {children && <div className="mt-3 text-sm leading-7 text-muted-foreground">{children}</div>}
      {actions && (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div>
      )}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative flex flex-1 items-center justify-center bg-hero px-4 py-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
