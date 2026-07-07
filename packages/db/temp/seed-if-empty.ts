import { prisma } from '../src';

try {
  const challengeCount = await prisma.challenge.count();

  if (challengeCount > 0) {
    console.log(`Skipping seed: found ${challengeCount} existing challenges.`);
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log('No challenges found. Seeding initial data...');
  await prisma.$disconnect();
  await import('../seed/prod');
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
