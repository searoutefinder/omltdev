// api/map-configs.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../lib/prisma.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const { orgSlug, serviceName } = req.query as {
      orgSlug?: string;
      serviceName?: string;
    };

    console.log("1. ORG SLUG ->", orgSlug);

    const configs = await prisma.mapConfig.findMany({
      where: {
        ...(orgSlug ? { organization: { slug: orgSlug } } : {}),
        ...(serviceName ? { serviceName } : {}),
      },
      include: {
        dataRefs: true,
        images: true,
        organization: { select: { id: true, slug: true, name: true } },
      },
    });

    res.status(200).json({ ok: true, count: configs.length, data: configs });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ ok: false, error: e?.message });
  }
}
