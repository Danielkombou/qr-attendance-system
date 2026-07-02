function ipToLong(ip: string): number | null {
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return null;
  }

  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

function matchesCidr(ip: string, rule: string): boolean {
  const trimmed = rule.trim();
  if (!trimmed) return false;

  if (!trimmed.includes("/")) {
    return ip === trimmed;
  }

  const [network, bitsRaw] = trimmed.split("/");
  const bits = Number(bitsRaw);
  if (!network || !Number.isInteger(bits) || bits < 0 || bits > 32) {
    return false;
  }

  const ipNum = ipToLong(ip);
  const networkNum = ipToLong(network);
  if (ipNum === null || networkNum === null) {
    return false;
  }

  if (bits === 0) return true;
  const mask = (~0 << (32 - bits)) >>> 0;
  return (ipNum & mask) === (networkNum & mask);
}

function parseAllowedRules(): string[] {
  return (process.env.ALLOWED_CHECKIN_IPS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function isPrivateIPv4(ip: string): boolean {
  if (ip.startsWith("192.168.") || ip.startsWith("10.")) return true;
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length === 4 && parts[0] === 172 && parts[1]! >= 16 && parts[1]! <= 31) {
    return true;
  }
  return false;
}

function isDevBypassIp(ip: string): boolean {
  if (process.env.ALLOW_OFFICE_NETWORK_BYPASS === "true") return true;
  if (process.env.NODE_ENV !== "development") return false;

  return ip === "127.0.0.1" || ip === "::1" || isPrivateIPv4(ip);
}

export type NetworkGateResult =
  | { allowed: true; clientIp: string }
  | { allowed: false; clientIp: string | null; reason: string };

export function verifyOfficeNetwork(clientIp: string | null): NetworkGateResult {
  if (!clientIp) {
    return {
      allowed: false,
      clientIp: null,
      reason: "Could not verify your network. Connect to the office Wi‑Fi and try again.",
    };
  }

  if (isDevBypassIp(clientIp)) {
    return { allowed: true, clientIp };
  }

  const rules = parseAllowedRules();
  if (rules.length === 0) {
    return {
      allowed: false,
      clientIp,
      reason: "Office network is not configured yet. Ask an admin to set ALLOWED_CHECKIN_IPS.",
    };
  }

  const allowed = rules.some((rule) => matchesCidr(clientIp, rule));
  if (!allowed) {
    return {
      allowed: false,
      clientIp,
      reason: "Check-in is only allowed from the company office network.",
    };
  }

  return { allowed: true, clientIp };
}
