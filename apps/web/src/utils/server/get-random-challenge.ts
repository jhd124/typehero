'use server';
import { prisma } from '@repo/db';

interface Result {
  slug: string;
}

export async function getRandomChallenge() {
  const result = await prisma
    .$queryRaw<Result[]>`SELECT slug FROM Challenge ORDER BY RAND() LIMIT 1`
    .catch((): Result[] => []);

  if (result.length > 0 && result[0] && Boolean(result[0].slug)) {
    return result[0].slug;
  }

  return null;
}
