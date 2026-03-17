import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create superuser
  const superuserEmail = process.env.FIRST_SUPERUSER_EMAIL || "dev@example.com";
  const superuserPassword = process.env.FIRST_SUPERUSER_PASSWORD || "DevPassword";
  const hashedPassword = await bcrypt.hash(superuserPassword, 10);

  const superuser = await prisma.user.upsert({
    where: { email: superuserEmail },
    update: {},
    create: {
      email: superuserEmail,
      hashedPassword,
      fullName: "Dev Admin",
      isActive: true,
      isSuperuser: true,
    },
  });
  console.log(`Created superuser: ${superuser.email}`);

  // Create test users
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      hashedPassword: await bcrypt.hash("AlicePassword123", 10),
      fullName: "Alice Johnson",
      isActive: true,
      isSuperuser: false,
    },
  });
  console.log(`Created user: ${alice.email}`);

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      hashedPassword: await bcrypt.hash("BobPassword123", 10),
      fullName: "Bob Smith",
      isActive: true,
      isSuperuser: false,
    },
  });
  console.log(`Created user: ${bob.email}`);

  async function upsertContacts(
    contacts: { organisation: string; description: string; country?: string | null }[],
    ownerId: string
  ) {
    for (const contact of contacts) {
      const existing = await prisma.contact.findFirst({
        where: { organisation: contact.organisation, ownerId },
      });
      if (!existing) {
        await prisma.contact.create({
          data: {
            organisation: contact.organisation,
            description: contact.description,
            country: contact.country ?? null,
            ownerId,
          },
        });
      }
    }
  }

  // Create sample contacts for superuser
  const superuserContacts = [
    { organisation: "OpenAI", description: "AI research company", country: "United States" },
    { organisation: "Anthropic", description: "AI safety company", country: "United States" },
    { organisation: "Google DeepMind", description: "AI research lab", country: null },
    { organisation: "Meta AI", description: "AI research division", country: "United States" },
    { organisation: "Microsoft Research", description: "Technology research", country: null },
    { organisation: "Amazon Web Services", description: "Cloud computing platform", country: "United States" },
    { organisation: "NVIDIA Corporation", description: "GPU and AI hardware manufacturer", country: "United States" },
    { organisation: "Hugging Face", description: "Open-source AI model hub", country: "United Kingdom" },
    { organisation: "Stability AI", description: "Generative AI startup", country: "United Kingdom" },
    { organisation: "Cohere", description: "Enterprise NLP platform", country: "United States" },
  ];

  await upsertContacts(superuserContacts, superuser.id);
  console.log(`Created ${superuserContacts.length} contacts for superuser`);

  // Create sample contacts for Alice
  const aliceContacts = [
    { organisation: "Acme Corp", description: "Manufacturing company", country: null },
    { organisation: "TechStart Inc", description: "Startup accelerator", country: null },
    { organisation: "BrightFuture GmbH", description: "Renewable energy consulting", country: "Germany" },
    { organisation: "Vertex Solutions", description: "Enterprise software integrations", country: null },
    { organisation: "NovaMed AG", description: "Medical device manufacturer", country: "Switzerland" },
    { organisation: "Finbridge Capital", description: "Venture capital firm", country: null },
    { organisation: "PixelCraft Studios", description: "UX design agency", country: null },
    { organisation: "GreenRoute Logistics", description: "Sustainable supply chain", country: null },
    { organisation: "EduSpark Learning", description: "Online education platform", country: null },
    { organisation: "AutoPilot Labs", description: "Autonomous vehicle research", country: null },
    { organisation: "HealthTrack GmbH", description: "Digital health monitoring", country: "Germany" },
    { organisation: "LegalEase Software", description: "Legal tech SaaS", country: null },
  ];

  await upsertContacts(aliceContacts, alice.id);
  console.log(`Created ${aliceContacts.length} contacts for Alice`);

  // Create sample contacts for Bob
  const bobContacts = [
    { organisation: "DataFlow Systems", description: "Data analytics", country: null },
    { organisation: "CloudNine Hosting", description: "Cloud infrastructure", country: null },
    { organisation: "SecureNet", description: "Cybersecurity services", country: null },
    { organisation: "Blockchain Ventures", description: "Web3 investment firm", country: null },
    { organisation: "RetailEdge AG", description: "Retail analytics platform", country: "Switzerland" },
    { organisation: "QuickShip Express", description: "Last-mile delivery service", country: null },
    { organisation: "SmartHome Systems", description: "IoT home automation", country: null },
    { organisation: "CyberGuard Inc", description: "Penetration testing & security audits", country: null },
    { organisation: "MarketPulse GmbH", description: "Market research and insights", country: "Germany" },
    { organisation: "CodeBridge Labs", description: "Offshore software development", country: null },
    { organisation: "AgroTech Solutions", description: "Precision agriculture technology", country: null },
    { organisation: "TravelSense AG", description: "Corporate travel management", country: "Switzerland" },
    { organisation: "FinScope Analytics", description: "Financial data intelligence", country: null },
  ];

  await upsertContacts(bobContacts, bob.id);
  console.log(`Created ${bobContacts.length} contacts for Bob`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
