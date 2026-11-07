import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
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
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-gradient shadow-glow">
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
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:gap-4 sm:px-6 md:flex md:justify-between">
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
        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
          {right ?? (
            <Button asChild variant="heroOutline" size="sm" className="min-h-11 md:min-h-0">
              <a href={LOGIN_HREF}>تسجيل الدخول</a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 md:hidden"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-site-navigation"
          aria-label="التنقل على الهاتف"
          className="grid grid-cols-3 gap-1 border-t border-border/60 px-4 py-2 text-sm md:hidden"
        >
          <Button asChild variant="ghost" className="min-h-11 px-2" onClick={() => setMenuOpen(false)}>
            <a href="/#features">المزايا</a>
          </Button>
          <Button asChild variant="ghost" className="min-h-11 px-2" onClick={() => setMenuOpen(false)}>
            <a href="/#systems">الأنظمة</a>
          </Button>
          <Button asChild variant="ghost" className="min-h-11 px-2" onClick={() => setMenuOpen(false)}>
            <Link to="/dashboard">لوحة التحكم</Link>
          </Button>
        </nav>
      )}
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
              <Link to="/" className="inline-flex min-h-11 items-center hover:text-foreground md:min-h-0">
                الرئيسية
              </Link>
            </li>
            <li>
              <a href="/#systems" className="inline-flex min-h-11 items-center hover:text-foreground md:min-h-0">
                الأنظمة
              </a>
            </li>
            <li>
              <Link to="/dashboard" className="inline-flex min-h-11 items-center hover:text-foreground md:min-h-0">
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
    <div
      className={cn(
        "mx-auto min-w-0 w-full max-w-lg rounded-2xl border border-border bg-panel p-5 text-center animate-in fade-in zoom-in-95 duration-300 sm:p-8",
        className,
      )}
    >
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
        <div className="mt-7 flex min-w-0 flex-col gap-3 [&_a]:min-h-11 [&_a]:whitespace-normal [&_button]:min-h-11 sm:flex-row sm:flex-wrap sm:justify-center">{actions}</div>
      )}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative flex min-w-0 flex-1 items-center justify-center bg-hero px-4 py-8 sm:py-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
