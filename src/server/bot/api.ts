import { getDiscordConfig } from "../discord/config";
import type { BotApiResult } from "@/lib/welcome";

export async function requestBotApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<BotApiResult<T>> {
  const cfg = getDiscordConfig();
  if (!cfg.ok || !cfg.config.apiBaseUrl || !cfg.config.apiSecret) {
    return {
      ok: false,
      reason: "not_configured",
      message: "لم يكتمل إعداد اتصال لوحة التحكم بالبوت. أضف عنوان واجهة البوت ومفتاح الاتصال في إعدادات الخادم.",
    };
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(cfg.config.apiBaseUrl);
  } catch {
    return {
      ok: false,
      reason: "not_configured",
      message: "عنوان واجهة البوت غير صالح. تحقق من قيمة SKYLER_API_BASE_URL.",
    };
  }

  if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost" && baseUrl.hostname !== "127.0.0.1") {
    return {
      ok: false,
      reason: "not_configured",
      message: "يجب استخدام اتصال HTTPS للوصول إلى واجهة البوت عبر الإنترنت.",
    };
  }

  try {
    const response = await fetch(new URL(path.replace(/^\//, ""), `${baseUrl.toString().replace(/\/$/, "")}/`), {
      ...init,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${cfg.config.apiSecret}`,
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | T
      | null;
    if (!response.ok) {
      return {
        ok: false,
        reason: "rejected",
        message:
          payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "رفض البوت الطلب. تحقق من إعداداته وصلاحياته.",
      };
    }
    if (!payload) {
      return { ok: false, reason: "unavailable", message: "أعاد البوت استجابة غير صالحة." };
    }
    return { ok: true, data: payload as T };
  } catch {
    return {
      ok: false,
      reason: "unavailable",
      message: "تعذّر الاتصال بالبوت. تحقق من تشغيله ومن عنوان واجهة الاتصال.",
    };
  }
}
