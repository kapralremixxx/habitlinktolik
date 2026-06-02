import { PrismaClient } from '@prisma/client';

// Use a singleton PrismaClient instance to avoid too many connections in dev environment
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development we reuse the same client across hot reloads
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export { prisma };
