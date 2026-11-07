import { describe, expect, it } from "vitest";
import { canManageGuild } from "@/lib/discord-permissions";

describe("canManageGuild", () => {
  it("allows the owner", () => expect(canManageGuild({ owner: true, permissions: "0" })).toBe(true));
  it("allows Administrator", () => expect(canManageGuild({ permissions: "8" })).toBe(true));
  it("allows Manage Server", () => expect(canManageGuild({ permissions: "32" })).toBe(true));
  it("rejects regular members", () => expect(canManageGuild({ permissions: "1024" })).toBe(false));
  it("rejects malformed permissions", () => expect(canManageGuild({ permissions: "x" })).toBe(false));
});
