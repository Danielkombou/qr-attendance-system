const { MembershipRole, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "techcorp" },
    update: {},
    create: {
      name: "TechCorp Inc.",
      slug: "techcorp",
      timezone: "UTC",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@techcorp.com" },
    update: {},
    create: {
      email: "admin@techcorp.com",
      name: "AttendX Admin",
      emailVerified: true,
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      userId_organizationId: {
        userId: admin.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: MembershipRole.OWNER,
      isActive: true,
    },
    create: {
      userId: admin.id,
      organizationId: organization.id,
      role: MembershipRole.OWNER,
      isActive: true,
    },
  });

  await prisma.site.upsert({
    where: { id: "seed-main-site" },
    update: {},
    create: {
      id: "seed-main-site",
      organizationId: organization.id,
      name: "Office - Floor 3",
      latitude: 37.7749,
      longitude: -122.4194,
      allowedRadiusM: 120,
      isActive: true,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
