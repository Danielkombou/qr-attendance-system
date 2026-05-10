const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
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

  console.log(`Seed complete. Admin user: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
