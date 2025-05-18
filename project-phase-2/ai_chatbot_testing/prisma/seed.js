const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Use upsert to avoid duplicates
  await prisma.user.upsert({
    where: { username: 'user1' },
    update: {},
    create: { username: 'user1', password: 'password1' },
  });

  await prisma.user.upsert({
    where: { username: 'user2' },
    update: {},
    create: { username: 'user2', password: 'password2' },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });