import { useState, type ReactNode } from "react";
import { Info, Save, Send, Users, UserRoundMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionTitle } from "@/components/dashboard/dashboard-ui";
import { StatePanel } from "@/components/site/site-chrome";
import {
  previewWelcomeMessage,
  type BotApiResult,
  type WelcomePayload,
  type WelcomeSettings,
} from "@/lib/welcome";
import { saveWelcomeSettings, sendWelcomeTest } from "@/lib/api/welcome.functions";

interface WelcomeSettingsPageProps {
  guildId: string;
  initialResult: BotApiResult<WelcomePayload>;
}

export function WelcomeSettingsPage({ guildId, initialResult }: WelcomeSettingsPageProps) {
  if (!initialResult.ok) {
    return (
      <div className="space-y-6">
        <SectionTitle title="الترحيب">
          إعداد رسائل دخول الأعضاء ومغادرتهم، مع معاينة الرسائل واختبارها قبل اعتمادها.
        </SectionTitle>
        <StatePanel icon={<Info />} title="الاتصال بالبوت غير جاهز">
          {initialResult.message}
        </StatePanel>
      </div>
    );
  }

  return (
    <WelcomeEditor
      guildId={guildId}
      initialSettings={initialResult.data.settings}
      channels={initialResult.data.channels}
    />
  );
}

function WelcomeEditor({
  guildId,
  initialSettings,
  channels,
}: {
  guildId: string;
  initialSettings: WelcomeSettings;
  channels: WelcomePayload["channels"];
}) {
  const [settings, setSettings] = useState<WelcomeSettings>({ ...initialSettings });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<"welcome" | "leave" | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null,
  );

  function update<K extends keyof WelcomeSettings>(key: K, value: WelcomeSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  async function save() {
    setSaving(true);
    setFeedback(null);
    try {
      const result = await saveWelcomeSettings({ data: { guildId, settings } });
      if (!result.ok) {
        setFeedback({ kind: "error", message: result.message });
      } else {
        setSettings(result.data.settings);
        setFeedback({ kind: "success", message: "تم حفظ إعدادات نظام الترحيب بنجاح." });
      }
    } catch {
      setFeedback({ kind: "error", message: "تعذّر حفظ الإعدادات. يُرجى المحاولة مجدداً." });
    } finally {
      setSaving(false);
    }
  }

  async function sendTest(kind: "welcome" | "leave") {
    setTesting(kind);
    setFeedback(null);
    try {
      const result = await sendWelcomeTest({ data: { guildId, kind, settings } });
      setFeedback(
        result.ok
          ? { kind: "success", message: "تم إرسال رسالة الاختبار إلى القناة المحددة." }
          : { kind: "error", message: result.message },
      );
    } catch {
      setFeedback({ kind: "error", message: "تعذّر إرسال رسالة الاختبار." });
    } finally {
      setTesting(null);
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="نظام الترحيب">
        تحكّم في رسائل دخول الأعضاء ومغادرتهم، واختر القنوات واكتب رسائلك باستخدام المتغيرات
        الديناميكية.
      </SectionTitle>

      <div className="grid gap-4 xl:grid-cols-2">
        <MessageCard
          title="رسالة الترحيب"
          description="تُرسل تلقائياً عند انضمام عضو جديد إلى الخادم."
          icon={<Users />}
          enabled={settings.welcomeEnabled}
          onEnabledChange={(value) => update("welcomeEnabled", value)}
          channelId={settings.welcomeChannelId}
          onChannelChange={(value) => update("welcomeChannelId", value)}
          message={settings.welcomeMessage}
          onMessageChange={(value) => update("welcomeMessage", value)}
          channels={channels}
          preview={previewWelcomeMessage(settings.welcomeMessage)}
          onTest={() => void sendTest("welcome")}
          testing={testing === "welcome"}
          testDisabled={!settings.welcomeEnabled || !settings.welcomeChannelId || testing !== null}
        />

        <MessageCard
          title="رسالة المغادرة"
          description="تُرسل تلقائياً عند مغادرة عضو للخادم."
          icon={<UserRoundMinus />}
          enabled={settings.leaveEnabled}
          onEnabledChange={(value) => update("leaveEnabled", value)}
          channelId={settings.leaveChannelId}
          onChannelChange={(value) => update("leaveChannelId", value)}
          message={settings.leaveMessage}
          onMessageChange={(value) => update("leaveMessage", value)}
          channels={channels}
          preview={previewWelcomeMessage(settings.leaveMessage)}
          onTest={() => void sendTest("leave")}
          testing={testing === "leave"}
          testDisabled={!settings.leaveEnabled || !settings.leaveChannelId || testing !== null}
        />
      </div>

      <div className="rounded-xl border border-border bg-panel p-4 sm:p-5">
        <h2 className="font-semibold">المتغيرات المتاحة</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          اكتب أي متغير داخل نص الرسالة وسيستبدله البوت تلقائياً بالقيمة المناسبة.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" dir="ltr">
          {[
            ["{user}", "منشن العضو"],
            ["{username}", "اسم العضو"],
            ["{server}", "اسم الخادم"],
            ["{memberCount}", "عدد الأعضاء"],
            ["{userId}", "معرّف العضو"],
            ["{serverId}", "معرّف الخادم"],
          ].map(([token, description]) => (
            <span
              key={token}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs"
            >
              <code className="font-mono text-foreground">{token}</code>
              <span dir="rtl" className="text-muted-foreground">{description}</span>
            </span>
          ))}
        </div>
      </div>

      {feedback && (
        <p
          role="status"
          className={feedback.kind === "success" ? "text-sm text-success" : "text-sm text-destructive"}
        >
          {feedback.message}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-6 text-muted-foreground">
          تُطبّق التغييرات على هذا الخادم فقط بعد حفظها.
        </p>
        <Button onClick={() => void save()} disabled={saving || testing !== null} variant="hero">
          {saving ? <span className="animate-spin">◌</span> : <Save />}
          {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
        </Button>
      </div>
    </div>
  );
}

function MessageCard({
  title,
  description,
  icon,
  enabled,
  onEnabledChange,
  channelId,
  onChannelChange,
  message,
  onMessageChange,
  channels,
  preview,
  onTest,
  testing,
  testDisabled,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  channelId: string | null;
  onChannelChange: (value: string | null) => void;
  message: string;
  onMessageChange: (value: string) => void;
  channels: WelcomePayload["channels"];
  preview: string;
  onTest: () => void;
  testing: boolean;
  testDisabled: boolean;
}) {
  const id = title === "رسالة الترحيب" ? "welcome" : "leave";
  return (
    <section className="min-w-0 rounded-xl border border-border bg-panel p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
            {icon}
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted-foreground">{enabled ? "مفعّل" : "متوقف"}</span>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} aria-label={`تفعيل ${title}`} />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <label htmlFor={`${id}-channel`} className="text-sm font-medium">قناة الإرسال</label>
          <Select value={channelId ?? "none"} onValueChange={(value) => onChannelChange(value === "none" ? null : value)}>
            <SelectTrigger id={`${id}-channel`} dir="rtl">
              <SelectValue placeholder="اختر قناة نصية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">لم تُحدّد قناة</SelectItem>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}># {channel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {channels.length === 0 && (
            <p className="text-xs text-muted-foreground">لا توجد قنوات متاحة يملك البوت صلاحية الإرسال فيها.</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={`${id}-message`} className="text-sm font-medium">نص الرسالة</label>
            <span className="text-xs tabular-nums text-muted-foreground">{message.length}/1800</span>
          </div>
          <Textarea
            id={`${id}-message`}
            dir="auto"
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            maxLength={1800}
            rows={4}
            className="min-h-28 resize-y leading-7"
            placeholder="اكتب نص الرسالة هنا…"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">معاينة الرسالة</p>
          <div
            dir="auto"
            className="min-h-16 whitespace-pre-wrap rounded-lg border border-border bg-background/70 p-3 text-sm leading-7"
          >
            {preview || "ستظهر معاينة الرسالة هنا."}
          </div>
        </div>

        <Button
          type="button"
          variant="heroOutline"
          size="sm"
          onClick={onTest}
          disabled={testDisabled}
          className="w-full"
        >
          <Send />
          {testing ? "جارٍ إرسال الاختبار…" : "إرسال رسالة اختبار"}
        </Button>
      </div>
    </section>
  );
}
