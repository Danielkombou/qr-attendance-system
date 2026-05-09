import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prefer a direct, non-pooled URL for migrations when provided (e.g., Neon DIRECT_URL).
    // Fallback to DATABASE_URL to keep local setup simple.
    url: process.env.DIRECT_URL || env("DATABASE_URL"),
  },
});
