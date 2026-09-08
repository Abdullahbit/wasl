import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Example community
  const community1 = await prisma.community.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Istanbul Tech Enthusiasts',
      description: 'A community for developers and tech enthusiasts in Istanbul.',
      category: 'Technology',
      languages: ['English', 'Turkish', 'Arabic'],
      universities: ['Beykoz University', 'Istanbul Technical University', 'Boğaziçi University'],
      interests: ['Software', 'AI', 'Networking'],
      location: 'Istanbul',
      targetAudience: 'Students and Professionals',
      joinUrl: 'https://example.com/join-tech',
      newcomerFriendly: true,
      verified: true,
      lastReviewed: new Date(),
    },
  });

  // Example resource
  const resource1 = await prisma.resource.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Istanbulkart Guide',
      description: 'Official guide on how to get a student transport card in Istanbul.',
      category: 'Transportation',
      url: 'https://example.com/istanbulkart',
      source: 'IBB',
      lastReviewed: new Date(),
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
