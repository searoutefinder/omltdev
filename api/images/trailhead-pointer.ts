// api/icons.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {

  const { orgId, serviceName } = req.query;
  const data = await prisma.image.findMany({
    where: { 
        orgId: String(orgId||""), 
        serviceName: String(serviceName||""), 
        kind: "trailhead-pointer", 
        active: true
     },
    select: { 
        iconCode: true, 
        url: true, 
        name: true 
    },
    orderBy: { 
        iconCode: "asc" 
    },
  });
  res.json({ 
    ok: true, 
    count: data.length, 
    data 
})
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ ok: false, error: e?.message });
  }
}
