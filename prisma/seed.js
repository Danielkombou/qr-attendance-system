require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to your environment before seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry(label, fn, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const transient = error?.code === "ETIMEDOUT" || error?.code === "ECONNRESET";
      if (!transient || attempt === attempts) throw error;
      const delay = 1000 * 2 ** (attempt - 1);
      console.warn(`[${label}] ${error.code} — retrying in ${delay}ms (attempt ${attempt}/${attempts - 1})`);
      await sleep(delay);
    }
  }
}

async function main() {
  await withRetry("site.upsert", () =>
    prisma.site.upsert({
      where: { id: "seed-main-site" },
      update: { isActive: true },
      create: {
        id: "seed-main-site",
        name: "Office",
        latitude: 37.7749,
        longitude: -122.4194,
        allowedRadiusM: 120,
        isActive: true,
      },
    }),
  );

  console.log("Seed complete. Default site id: seed-main-site");
  console.log("Next: sign up at /get-started, then run `node prisma/promote-admin.js <email>` to grant ADMIN.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
