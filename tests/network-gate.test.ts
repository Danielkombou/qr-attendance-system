import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { verifyOfficeNetwork } from "../lib/server/network-gate";

describe("verifyOfficeNetwork", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ALLOWED_CHECKIN_IPS;
    delete process.env.ALLOW_OFFICE_NETWORK_BYPASS;
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("rejects when IP is missing", () => {
    const result = verifyOfficeNetwork(null);
    expect(result.allowed).toBe(false);
  });

  it("allows configured public office IP", () => {
    process.env.ALLOWED_CHECKIN_IPS = "203.0.113.45";
    const result = verifyOfficeNetwork("203.0.113.45");
    expect(result.allowed).toBe(true);
  });

  it("allows CIDR office range", () => {
    process.env.ALLOWED_CHECKIN_IPS = "192.168.1.0/24";
    const result = verifyOfficeNetwork("192.168.1.88");
    expect(result.allowed).toBe(true);
  });

  it("rejects IP outside office range", () => {
    process.env.ALLOWED_CHECKIN_IPS = "203.0.113.45";
    const result = verifyOfficeNetwork("198.51.100.10");
    expect(result.allowed).toBe(false);
  });
});
