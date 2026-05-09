import { PrismaClient } from "@prisma/client";
import { createRequire } from "node:module";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const require = createRequire(import.meta.url);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to your environment before starting AttendX.");
}

function createPrismaClient() {
  try {
    const { PrismaPg } = require("@prisma/adapter-pg") as {
      PrismaPg: new (options: { connectionString: string }) => unknown;
    };

    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
  } catch {
    throw new Error(
      "Prisma 7 requires @prisma/adapter-pg and pg. Install them with: pnpm add @prisma/adapter-pg pg",
    );
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
