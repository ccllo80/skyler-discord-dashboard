import { describe, expect, it } from "vitest";
import {
  STATE_COOKIES,
  isValidState,
  randomState,
  seal,
  sealSession,
  stateCookie,
  unseal,
  unsealSession,
} from "@/server/discord/session";
import { fetchAllGuilds } from "@/server/discord/oauth";

const SECRET = "x".repeat(40);
const user = { id: "1", username: "u", globalName: null, avatar: null };

describe("OAuth state", () => {
  it("uses separate cookies for login and invite", () => {
    expect(STATE_COOKIES.login).not.toBe(STATE_COOKIES.invite);
  });
  it("state cookie is HttpOnly, Secure, SameSite=Lax and 10 minutes", () => {
    const c = stateCookie("login", "abc");
    expect(c).toContain("HttpOnly");
    expect(c).toContain("Secure");
    expect(c).toContain("SameSite=Lax");
    expect(c).toContain("Max-Age=600");
  });
  it("accepts a matching state", () => {
    const s = randomState();
    expect(isValidState(s, s)).toBe(true);
  });
  it("rejects mismatched, missing or malformed state", () => {
    const s = randomState();
    expect(isValidState(s, randomState())).toBe(false);
    expect(isValidState(undefined, s)).toBe(false);
    expect(isValidState(s, null)).toBe(false);
    expect(isValidState("short", "short")).toBe(false);
  });
});

describe("session sealing", () => {
  it("round-trips a valid session", async () => {
    const v = await sealSession({ accessToken: "t", expiresAt: Date.now() + 60_000, user }, SECRET);
    expect((await unsealSession(v, SECRET))?.user.id).toBe("1");
  });
  it("rejects expired sessions", async () => {
    const v = await sealSession({ accessToken: "t", expiresAt: Date.now() - 1, user }, SECRET);
    expect(await unsealSession(v, SECRET)).toBeNull();
  });
  it("rejects a wrong secret and tampering", async () => {
    const v = await sealSession({ accessToken: "t", expiresAt: Date.now() + 60_000, user }, SECRET);
    expect(await unsealSession(v, "y".repeat(40))).toBeNull();
    expect(await unsealSession(v.slice(0, -2) + "AA", SECRET)).toBeNull();
  });
  it("does not accept an invite proof as a session", async () => {
    const proof = await seal({ exp: Date.now() + 1000 }, SECRET, "invite_ok");
    expect(await unseal(proof, SECRET, "session")).toBeNull();
  });
});

describe("guild pagination", () => {
  it("fetches all pages, not just the first 200", async () => {
    const ids = Array.from({ length: 450 }, (_, i) => ({ id: String(1000 + i) }));
    const fake = (async (url: string) => {
      const after = Number(new URL(url).searchParams.get("after"));
      const page = ids.filter((g) => Number(g.id) > after).slice(0, 200);
      return new Response(JSON.stringify(page), { status: 200 });
    }) as unknown as typeof fetch;
    expect((await fetchAllGuilds("Bot x", fake)).length).toBe(450);
  });
  it("throws on Discord errors instead of returning partial data", async () => {
    const fake = (async () => new Response("{}", { status: 500 })) as unknown as typeof fetch;
    await expect(fetchAllGuilds("Bot x", fake)).rejects.toThrow();
  });
});
