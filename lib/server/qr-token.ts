import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const QR_SECRET = process.env.QR_TOKEN_SECRET ?? "dev-qr-secret-change-me";

type QRPayload = {
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return createHmac("sha256", QR_SECRET).update(payload).digest("base64url");
}

export function createQRToken(ttlSeconds = 45) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + ttlSeconds * 1000;
  const nonce = randomUUID();
  const payload = base64UrlEncode(JSON.stringify({ issuedAt, expiresAt, nonce } satisfies QRPayload));
  const token = `${payload}.${signPayload(payload)}`;
  return { token, tokenHash: hashToken(token), nonce, issuedAt, expiresAt };
}

export function verifyQRToken(token: string): QRPayload | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = signPayload(payload);
  const valid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return null;

  const parsed = JSON.parse(base64UrlDecode(payload)) as QRPayload;
  if (parsed.expiresAt < Date.now()) return null;
  return parsed;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
