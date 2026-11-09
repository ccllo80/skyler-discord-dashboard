import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getGuildAccess } from "@/lib/api/auth.functions";
import type { WelcomeSettings } from "@/lib/welcome";

const guildIdSchema = z.string().regex(/^\d{17,20}$/);
const settingsSchema = z.object({
  welcomeEnabled: z.boolean(),
  welcomeChannelId: z.string().regex(/^\d{17,20}$/).nullable(),
  welcomeMessage: z.string().min(1).max(1800),
  leaveEnabled: z.boolean(),
  leaveChannelId: z.string().regex(/^\d{17,20}$/).nullable(),
  leaveMessage: z.string().min(1).max(1800),
});

export const getWelcomeSettings = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ guildId: guildIdSchema }).parse(data))
  .handler(async ({ data }) => {
    await getGuildAccess({ data: { guildId: data.guildId } });
    const { getWelcomeSettings: fetchSettings } = await import("@/server/bot/welcome");
    return fetchSettings(data.guildId);
  });

export const saveWelcomeSettings = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ guildId: guildIdSchema, settings: settingsSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    await getGuildAccess({ data: { guildId: data.guildId } });
    const { saveWelcomeSettings: saveSettings } = await import("@/server/bot/welcome");
    return saveSettings(data.guildId, data.settings as WelcomeSettings);
  });

export const sendWelcomeTest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ guildId: guildIdSchema, kind: z.enum(["welcome", "leave"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    await getGuildAccess({ data: { guildId: data.guildId } });
    const { sendWelcomeTest: sendTest } = await import("@/server/bot/welcome");
    return sendTest(data.guildId, data.kind, data.settings as WelcomeSettings);
  });
