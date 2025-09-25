// scripts/backfill-image-dataset-keys.ts
import prisma from "../../lib/prisma.js";

async function run() {
  const images = await prisma.image.findMany({
    where: { mapConfigId: { not: null } },
    select: { id: true, mapConfigId: true },
  });

  for (const img of images) {
    const cfg = await prisma.mapConfig.findUnique({
      where: { id: img.mapConfigId! },
      select: { orgId: true, serviceName: true, slug: true },
    });
    if (!cfg) continue;

    await prisma.image.update({
      where: { id: img.id },
      data: {
        orgId: cfg.orgId ?? undefined,
        serviceName: cfg.serviceName ?? undefined,
        preserveSlug: cfg.slug,
      },
    });
  }
  console.log("Backfill complete ✅");
}

run().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
