// Encrypted (AES-GCM) session cookie. Tokens never reach browser JS (HttpOnly).

export const SESSION_COOKIE = "skyler_session";
export const STATE_COOKIE = "skyler_oauth_state";

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

export async function sealSession(data: SessionData, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(secret), enc.encode(JSON.stringify(data)));
  return `${b64url(iv)}.${b64url(new Uint8Array(ct))}`;
}

export async function unsealSession(value: string | undefined, secret: string): Promise<SessionData | null> {
  if (!value) return null;
  try {
    const [iv = "", ct = ""] = value.split(".");
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64url(iv) }, await key(secret), fromB64url(ct));
    const data = JSON.parse(dec.decode(pt)) as SessionData;
    if (data.expiresAt < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function randomState() {
  return b64url(crypto.getRandomValues(new Uint8Array(24)));
}

export function cookie(name: string, value: string, maxAge: number, path = "/") {
  return `${name}=${value}; Path=${path}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/** Constant-time-ish string compare for state validation. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function redirectTo(location: string, cookies: string[] = []) {
  const headers = new Headers({ location, "cache-control": "no-store" });
  cookies.forEach((c) => headers.append("set-cookie", c));
  return new Response(null, { status: 302, headers });
}
