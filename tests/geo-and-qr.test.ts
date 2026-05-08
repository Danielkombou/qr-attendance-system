import { haversineDistanceMeters } from "../lib/server/geofence";
import { createQRToken, verifyQRToken } from "../lib/server/qr-token";

describe("geofence and qr security primitives", () => {
  it("computes near-zero distance for same coordinates", () => {
    const distance = haversineDistanceMeters(37.7749, -122.4194, 37.7749, -122.4194);
    expect(distance).toBeLessThan(1);
  });

  it("creates and validates a signed qr token", () => {
    const { token } = createQRToken("org_1", "site_1", 45);
    const payload = verifyQRToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.organizationId).toBe("org_1");
    expect(payload?.siteId).toBe("site_1");
  });
});
