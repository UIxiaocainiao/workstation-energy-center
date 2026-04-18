import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { env } from "../config/env";

type OAuthStatePayload = {
  nonce: string;
  ts: number;
};

const STATE_TTL_MS = 1000 * 60 * 10;

function toBase64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(base64, "base64").toString("utf8");
}

function sign(value: string) {
  return toBase64Url(createHmac("sha256", env.authSecret).update(value).digest());
}

export function createOAuthState() {
  const payload: OAuthStatePayload = {
    nonce: randomBytes(12).toString("hex"),
    ts: Date.now(),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyOAuthState(state: string) {
  const [encodedPayload, receivedSig] = state.split(".");
  if (!encodedPayload || !receivedSig) return false;

  const expectedSig = sign(encodedPayload);
  const receivedBuffer = Buffer.from(receivedSig);
  const expectedBuffer = Buffer.from(expectedSig);

  if (receivedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(receivedBuffer, expectedBuffer)) return false;

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as OAuthStatePayload;
    if (typeof parsed.ts !== "number") return false;
    if (Date.now() - parsed.ts > STATE_TTL_MS) return false;
    return true;
  } catch {
    return false;
  }
}
