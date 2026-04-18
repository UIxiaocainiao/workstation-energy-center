import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

const PASSWORD_KEY_LENGTH = 64;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");
  return `${salt}.${digest}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedDigest] = passwordHash.split(".");
  if (!salt || !storedDigest) return false;

  const candidateDigest = scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  const storedDigestBuffer = Buffer.from(storedDigest, "hex");

  if (candidateDigest.length !== storedDigestBuffer.length) return false;
  return timingSafeEqual(candidateDigest, storedDigestBuffer);
}

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
