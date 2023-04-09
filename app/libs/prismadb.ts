import { PrismaClient } from '@prisma/client';

// This is to prevent the creation of too many instances of 'PrismaClient' because of Nextjs hot reload.

//This variable is not affected by NextJs hot reload.
declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export default client;
