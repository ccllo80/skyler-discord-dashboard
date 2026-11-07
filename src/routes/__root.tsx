import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Compass, TriangleAlert } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PageShell, StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <PageShell>
      <StatePanel
        icon={<Compass />}
        title="الصفحة غير موجودة"
        actions={
          <Button asChild variant="hero">
            <Link to="/">العودة إلى الرئيسية</Link>
          </Button>
        }
      >
        تعذّر العثور على الصفحة المطلوبة، فربما نُقلت أو لم تعد متاحة.
      </StatePanel>
    </PageShell>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <PageShell>
      <StatePanel
        tone="danger"
        icon={<TriangleAlert />}
        title="تعذّر تحميل الصفحة"
        actions={
          <>
            <Button
              variant="hero"
              onClick={() => {
                router.invalidate();
                reset();
              }}
            >
              إعادة المحاولة
            </Button>
            <Button asChild variant="heroOutline">
              <a href="/">العودة إلى الرئيسية</a>
            </Button>
          </>
        }
      >
        حدث خطأ غير متوقع. يُرجى إعادة المحاولة بعد قليل.
      </StatePanel>
    </PageShell>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SKYLER — بوت إدارة خوادم ديسكورد" },
      { name: "description", content: "SKYLER بوت متكامل لإدارة خوادم ديسكورد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#141518" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@500;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
