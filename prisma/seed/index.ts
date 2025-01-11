import { PrismaClient, User } from "@prisma/client";
import { profiles, users } from "./data";

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    users.map(async (user: Omit<User, "id">, i: number) => {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          profile: {
            create: {
              bio: profiles[i].bio,
            },
          },
        },
      });
    })
  );
  console.log("\n🌱 Seeded database with users and profiles 🌱\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
