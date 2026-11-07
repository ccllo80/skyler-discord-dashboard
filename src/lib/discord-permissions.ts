const ADMINISTRATOR = 0x8n;
const MANAGE_GUILD = 0x20n;

/** Server-side rule: a user can manage a guild if owner, Administrator, or Manage Server. */
export function canManageGuild(guild: { owner?: boolean; permissions: string }): boolean {
  if (guild.owner) return true;
  let perms: bigint;
  try {
    perms = BigInt(guild.permissions);
  } catch {
    return false;
  }
  return (perms & ADMINISTRATOR) === ADMINISTRATOR || (perms & MANAGE_GUILD) === MANAGE_GUILD;
}
