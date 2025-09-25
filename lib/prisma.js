/* eslint-disable no-undef */
import { PrismaClient } from "@prisma/client";

const g = globalThis;

const prisma = g.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") g.prisma = prisma;

export default prisma; // <-- VAŽNO: exportiramo klijent, ne objekt
