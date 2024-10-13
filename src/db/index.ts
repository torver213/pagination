import { PrismaClient } from "@prisma/client";

// Define the type for the global object with the 'prisma' property
declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

// Check if we are running in production mode
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Check if there is already a connection to the database
  const globalObj = global as any
  if (!globalObj.prisma) {
    globalObj.prisma = new PrismaClient();
  }
  prisma = globalObj.prisma;
}

export default prisma;

