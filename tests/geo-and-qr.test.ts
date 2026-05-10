import { haversineDistanceMeters } from "../lib/server/geofence";
import { createQRToken, verifyQRToken } from "../lib/server/qr-token";

describe("geofence and qr token primitives", () => {
  it("computes near-zero distance for same coordinates", () => {
    const distance = haversineDistanceMeters(37.7749, -122.4194, 37.7749, -122.4194);
    expect(distance).toBeLessThan(1);
  });

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
