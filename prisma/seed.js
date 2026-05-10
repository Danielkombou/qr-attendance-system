require("dotenv/config");
const { PrismaClient, Role } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to your environment before seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  await prisma.site.upsert({
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
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@attendx.local" },
    update: { role: Role.ADMIN },
    create: {
      email: "admin@attendx.local",
      name: "AttendX Admin",
      emailVerified: true,
      role: Role.ADMIN,
    },
  });

  console.log(`Seed complete. Site id: seed-main-site. Admin: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
