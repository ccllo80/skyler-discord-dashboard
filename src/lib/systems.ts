import {
  Hand,
  TrendingUp,
  MessageSquareReply,
  ShieldCheck,
  LayoutTemplate,
  Tags,
  TerminalSquare,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export type SystemStatus = "soon" | "available";

export interface DashboardSystem {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: SystemStatus;
}

// Every system is "soon" until the bot API integration exists.
export const SYSTEMS: DashboardSystem[] = [
  { slug: "welcome", name: "الترحيب", description: "رسائل ترحيب ووداع مخصصة للأعضاء الجدد والمغادرين.", icon: Hand, status: "soon" },
  { slug: "levels", name: "المستويات", description: "نظام خبرة ومستويات يكافئ تفاعل الأعضاء.", icon: TrendingUp, status: "soon" },
  { slug: "auto-reply", name: "الرد التلقائي", description: "ردود آلية على كلمات وعبارات محددة.", icon: MessageSquareReply, status: "soon" },
  { slug: "moderation", name: "الإشراف", description: "أدوات حماية وإشراف لضبط الخادم والحد من الإساءة.", icon: ShieldCheck, status: "soon" },
  { slug: "embeds", name: "الإمبيدات", description: "إنشاء رسائل إمبيد منسقة وإرسالها إلى القنوات.", icon: LayoutTemplate, status: "soon" },
  { slug: "reaction-roles", name: "الرتب التفاعلية", description: "منح الرتب للأعضاء عبر التفاعلات والأزرار.", icon: Tags, status: "soon" },
  { slug: "commands", name: "الأوامر", description: "إدارة أوامر البوت وصلاحيات استخدامها.", icon: TerminalSquare, status: "soon" },
  { slug: "logs", name: "السجلات", description: "تتبع أحداث الخادم وتسجيلها في قنوات مخصصة.", icon: ScrollText, status: "soon" },
];

export function findSystem(slug: string) {
  return SYSTEMS.find((s) => s.slug === slug);
}

export const STATUS_LABEL: Record<SystemStatus, string> = {
  soon: "قريباً",
  available: "متاح",
};
