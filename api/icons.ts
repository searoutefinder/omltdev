// api/icons.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../lib/prisma.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const { type } = req.query as { type?: string };

    const icons = await prisma.icon.findMany({
      where: type ? { 
        type, 
        active: true
       } : { active: true },
      orderBy: { 
        code: "asc"
       },
    });

    res.status(200).json({ ok: true, data: icons });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ ok: false, error: e?.message });
  }
}
