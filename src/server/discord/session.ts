// Encrypted (AES-GCM) cookies. Tokens never reach browser JS (HttpOnly) and are never returned to the client.

export const SESSION_COOKIE = "skyler_session";
export const INVITE_OK_COOKIE = "skyler_invite_ok";
export type OAuthFlow = "login" | "invite";
export const STATE_COOKIES: Record<OAuthFlow, string> = {
  login: "skyler_login_state",
  invite: "skyler_invite_state",
};
/** State cookies are only sent to the OAuth routes. */
export const STATE_COOKIE_PATH = "/api/public/auth/discord";
export const STATE_MAX_AGE = 600;
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionData {
  accessToken: string;
  expiresAt: number;
  user: { id: string; username: string; globalName: string | null; avatar: string | null };
}

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(str: string) {
  const s = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

async function key(secret: string) {
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, ["encrypt", "decrypt"]);
}

/** Encrypts any JSON payload; `purpose` is bound as AAD so one cookie type can't be replayed as another. */
export async function seal(data: unknown, secret: string, purpose: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: enc.encode(purpose) },
    await key(secret),
    enc.encode(JSON.stringify(data)),
  );
  return `${b64url(iv)}.${b64url(new Uint8Array(ct))}`;
}

export async function unseal<T>(
  value: string | undefined,
  secret: string,
  purpose: string,
): Promise<T | null> {
  if (!value) return null;
  try {
    const [iv = "", ct = "", extra] = value.split(".");
    if (!iv || !ct || extra !== undefined) return null;
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64url(iv), additionalData: enc.encode(purpose) },
      await key(secret),
      fromB64url(ct),
    );
    return JSON.parse(dec.decode(pt)) as T;
  } catch {
    return null;
  }
}

export function sealSession(data: SessionData, secret: string) {
  return seal(data, secret, "session");
}

export async function unsealSession(
  value: string | undefined,
  secret: string,
): Promise<SessionData | null> {
  const data = await unseal<SessionData>(value, secret, "session");
  if (
    !data ||
    typeof data.accessToken !== "string" ||
    typeof data.expiresAt !== "number" ||
    !data.user?.id
  )
    return null;
  if (data.expiresAt <= Date.now()) return null;
  return data;
}

export function randomState() {
  return b64url(crypto.getRandomValues(new Uint8Array(32)));
}

export function cookie(name: string, value: string, maxAge: number, path = "/") {
  return `${name}=${value}; Path=${path}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function stateCookie(flow: OAuthFlow, value: string) {
  return cookie(STATE_COOKIES[flow], value, STATE_MAX_AGE, STATE_COOKIE_PATH);
}
export function clearStateCookie(flow: OAuthFlow) {
  return cookie(STATE_COOKIES[flow], "", 0, STATE_COOKIE_PATH);
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/** Constant-time string compare. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Strict state check: both present, well-formed, and identical. */
export function isValidState(expected: string | undefined, received: string | null): boolean {
  if (!expected || !received) return false;
  if (!/^[A-Za-z0-9_-]{43}$/.test(expected)) return false;
  return safeEqual(expected, received);
}

export function redirectTo(location: string, cookies: string[] = [], status = 302) {
  const headers = new Headers({ location, "cache-control": "no-store" });
  cookies.forEach((c) => headers.append("set-cookie", c));
  return new Response(null, { status, headers });
}
