import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { BotStatus } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

export function BotStatusBadge({ status }: { status: BotStatus }) {
  const map = {
    present: { label: "البوت متصل", cls: "border-success/30 text-success", dot: "bg-success" },
    absent: {
      label: "البوت غير موجود",
      cls: "border-border text-muted-foreground",
      dot: "bg-muted-foreground",
    },
    unknown: {
      label: "حالة البوت غير متاحة",
      cls: "border-warning/30 text-warning",
      dot: "bg-warning",
    },
  }[status];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs leading-5",
        map.cls,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", map.dot)} aria-hidden />
      {map.label}
    </span>
  );
}

export function SoonBadge() {
  return (
    <span className="shrink-0 whitespace-nowrap rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
      قريباً
    </span>
  );
}

export function AvailableBadge() {
  return (
    <span className="shrink-0 whitespace-nowrap rounded-full border border-border px-2 py-0.5 text-[11px] text-foreground">
      متاح
    </span>
  );
}

export function PendingState({ label = "جارٍ التحميل…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
    >
      <Loader2 className="size-6 animate-spin text-glow" aria-hidden />
      {label}
    </div>
  );
}

export function SectionTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 min-w-0 sm:mb-8">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {children && <p className="mt-2 text-sm leading-7 text-muted-foreground">{children}</p>}
    </div>
  );
}
