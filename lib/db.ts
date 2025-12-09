import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // ให้มันพ่น Log ออกมาดูเล่นว่ามันส่ง SQL อะไรไปบ้าง
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;