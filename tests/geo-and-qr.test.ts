import { createQRToken, verifyQRToken } from "../lib/server/qr-token";

describe("qr token security primitives", () => {
  it("creates and validates a signed qr token", () => {
    const { token, nonce, expiresAt } = createQRToken(45);
    const payload = verifyQRToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.nonce).toBe(nonce);
    expect(payload?.expiresAt).toBe(expiresAt);
  });

  it("rejects a tampered token", () => {
    const { token } = createQRToken(45);
    const tampered = `${token.split(".")[0]}.invalidsig`;
    expect(verifyQRToken(tampered)).toBeNull();
  });
});
