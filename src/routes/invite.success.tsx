import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import { PageShell, StatePanel } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";

// Reached only via the server invite callback after a validated authorization.
export const Route = createFileRoute("/invite/success")({
  head: () => ({
    meta: [
      { title: "تمت إضافة البوت — SKYLER" },
      { name: "description", content: "اكتملت إضافة SKYLER إلى خادمك." },
      { property: "og:title", content: "تمت إضافة البوت — SKYLER" },
      { property: "og:description", content: "اكتملت إضافة SKYLER إلى خادمك." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <PageShell>
      <StatePanel tone="success" icon={<CircleCheck />} title="تمت إضافة البوت بنجاح"
        actions={<Button asChild variant="hero" size="lg" className="min-w-40"><Link to="/">متابعة</Link></Button>}>
        أصبح SKYLER الآن ضمن خادمك. يمكنك العودة إلى الصفحة الرئيسية للمتابعة.
      </StatePanel>
    </PageShell>
  ),
});
