import { describe, expect, it } from "vitest";
import { buildDiscordRedirectUris } from "@/lib/discord-setup";

const PREVIEW_ORIGIN = "https://id-preview--99559357-085c-4cd2-b951-9348b0d8b641.lovable.app";

describe("Discord OAuth setup metadata", () => {
  it("builds the exact login and invite redirect URIs for the current preview origin", () => {
    expect(buildDiscordRedirectUris(PREVIEW_ORIGIN)).toEqual({
      login: `${PREVIEW_ORIGIN}/api/public/auth/discord/callback`,
      invite: `${PREVIEW_ORIGIN}/api/public/auth/discord/invite-callback`,
    });
  });
});
