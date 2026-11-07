import { createFileRoute } from "@tanstack/react-router";
import { LogIn, KeyRound } from "lucide-react";
import { LOGIN_HREF, PageShell, StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — SKYLER" },
      { name: "description", content: "سجّل الدخول بحساب ديسكورد للوصول إلى لوحة تحكم SKYLER." },
      { property: "og:title", content: "تسجيل الدخول — SKYLER" },
      { property: "og:description", content: "سجّل الدخول بحساب ديسكورد للوصول إلى لوحة التحكم." },
    ],
  }),
  component: () => (
    <PageShell>
      <StatePanel
        icon={<KeyRound />}
        title="تسجيل الدخول مطلوب"
        actions={
          <Button asChild variant="hero" size="lg">
            <a href={LOGIN_HREF}>
              <LogIn />
              تسجيل الدخول عبر ديسكورد
            </a>
          </Button>
        }
      >
        للوصول إلى لوحة التحكم، يُرجى تسجيل الدخول بحسابك في ديسكورد.
      </StatePanel>
    </PageShell>
  ),
});
