import "server-only";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

let db: PrismaClient;

if (globalForPrisma.prisma) {
  db = globalForPrisma.prisma;
} else {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      // Allows the driver to bypass local self-signed certificate chain drops
      rejectUnauthorized: false,
    },
  });
  const adapter = new PrismaPg(pool);
  db = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
    globalForPrisma.pool = pool;

    process.on("SIGTERM", async () => {
      await globalForPrisma.pool?.end();
    });
  }
}

export default db;
