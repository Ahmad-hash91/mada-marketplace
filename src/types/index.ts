import type { User, Store, Product } from "@/generated/prisma/client";

export type JWTPayload = {
  id: number;
  role: string;
  exp: number;
};

export type { User, Store, Product };
