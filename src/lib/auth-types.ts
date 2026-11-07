export type BotStatus = "present" | "absent" | "unknown";

export interface PublicUser {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
}

export interface GuildSummary {
  id: string;
  name: string;
  icon: string | null;
  botStatus: BotStatus;
}

export function guildIconUrl(g: { id: string; icon: string | null }) {
  return g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=128` : null;
}
