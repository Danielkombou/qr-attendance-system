require("dotenv/config");
const { PrismaClient, Role } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const email = process.argv[2];
if (!email) {
  console.error("Usage: node prisma/promote-admin.js <email>");
  process.exit(1);
}

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email ${email}. Sign up at /get-started first.`);
    process.exit(2);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: Role.ADMIN },
    select: { email: true, role: true },
  });

  console.log(`Promoted ${updated.email} to ${updated.role}.`);
  console.log("Sign out and sign back in so the role cookie refreshes.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
