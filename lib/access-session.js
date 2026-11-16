import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export const ACCESS_COOKIE_NAME = "mate_access"
export const ACCESS_SESSION_TTL_SECONDS = 60 * 60 * 24

function equalDigest(left, right) {
  const leftDigest = createHash("sha256").update(left, "utf8").digest()
  const rightDigest = createHash("sha256").update(right, "utf8").digest()
  return timingSafeEqual(leftDigest, rightDigest)
}

export function matchesAccessKey(candidate, expected) {
  return typeof candidate === "string" && typeof expected === "string" && expected.length > 0 && equalDigest(candidate, expected)
}

export function createAccessSession(secret, now = Date.now()) {
  const expiresAt = String(now + ACCESS_SESSION_TTL_SECONDS * 1000)
  const signature = createHmac("sha256", secret).update(expiresAt).digest("base64url")
  return `${expiresAt}.${signature}`
}

export function verifyAccessSession(token, secret, now = Date.now()) {
  if (typeof token !== "string" || typeof secret !== "string" || secret.length === 0) return false

  const [expiresAt, signature, extra] = token.split(".")
  if (!expiresAt || !signature || extra !== undefined || !/^\d+$/.test(expiresAt)) return false
  if (Number(expiresAt) <= now) return false

  const expectedSignature = createHmac("sha256", secret).update(expiresAt).digest("base64url")
  return equalDigest(signature, expectedSignature)
}
