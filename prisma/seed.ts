import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KTU Student Ecosystem...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set before running the seed."
    );
  }

  if (adminPassword.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters long.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      role: "ADMIN",
      isBlocked: false,
    },
    create: {
      name: "KTU Ecosystem Administrator",
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin ready: ${admin.email}`);

  // Foundation taxonomy only. No fabricated subject/resource data is seeded.
  const scheme = await prisma.scheme.upsert({
    where: { code: "2024" },
    update: {
      name: "KTU 2024 Scheme",
      description:
        "Foundation record for the KTU 2024 scheme. Official branch and subject curriculum data should be added only after verification.",
      isActive: true,
    },
    create: {
      name: "KTU 2024 Scheme",
      code: "2024",
      description:
        "Foundation record for the KTU 2024 scheme. Official branch and subject curriculum data should be added only after verification.",
      isActive: true,
    },
  });

  for (let number = 1; number <= 8; number += 1) {
    await prisma.semester.upsert({
      where: {
        schemeId_number: {
          schemeId: scheme.id,
          number,
        },
      },
      update: {
        name: `S${number}`,
      },
      create: {
        number,
        name: `S${number}`,
        schemeId: scheme.id,
      },
    });
  }

  console.log("✅ KTU foundation: 2024 Scheme + S1–S8");
  console.log("🎉 Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
