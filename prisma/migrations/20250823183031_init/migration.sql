-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MapConfig" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "slug" TEXT NOT NULL,
    "orgId" TEXT,
    "serviceName" TEXT,
    "webMapName" TEXT,
    "owner" TEXT,
    "logoURL" TEXT,
    "contactEmail" TEXT,
    "cityAndState" TEXT,
    "promotion" BOOLEAN NOT NULL DEFAULT false,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "zoom" DOUBLE PRECISION NOT NULL DEFAULT 14,
    "pitch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bearing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minZoom" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "maxZoom" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "maxPitch" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "bboxMinLng" DOUBLE PRECISION,
    "bboxMinLat" DOUBLE PRECISION,
    "bboxMaxLng" DOUBLE PRECISION,
    "bboxMaxLat" DOUBLE PRECISION,
    "donationLng" DOUBLE PRECISION,
    "donationLat" DOUBLE PRECISION,
    "preserveType" TEXT,
    "description" TEXT,
    "preserveGeojson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DataRefs" (
    "id" TEXT NOT NULL,
    "mapConfigId" TEXT NOT NULL,
    "masterTable" TEXT,
    "preserve" TEXT,
    "trails" TEXT,
    "pois" TEXT,
    "trailheads" TEXT,
    "parkingLots" TEXT,
    "distances" TEXT,
    "trailSourceName" TEXT,
    "mainSource" JSONB,

    CONSTRAINT "DataRefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Icon" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dataLabel" TEXT,
    "url" TEXT NOT NULL,
    "mime" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "mapConfigId" TEXT,
    "kind" TEXT NOT NULL,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "tags" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "public"."Organization"("slug");

-- CreateIndex
CREATE INDEX "MapConfig_organizationId_idx" ON "public"."MapConfig"("organizationId");

-- CreateIndex
CREATE INDEX "MapConfig_slug_idx" ON "public"."MapConfig"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MapConfig_orgId_serviceName_slug_key" ON "public"."MapConfig"("orgId", "serviceName", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "DataRefs_mapConfigId_key" ON "public"."DataRefs"("mapConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "Icon_code_key" ON "public"."Icon"("code");

-- CreateIndex
CREATE INDEX "icons_type_idx" ON "public"."Icon"("type");

-- CreateIndex
CREATE INDEX "Image_mapConfigId_kind_idx" ON "public"."Image"("mapConfigId", "kind");

-- AddForeignKey
ALTER TABLE "public"."MapConfig" ADD CONSTRAINT "MapConfig_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DataRefs" ADD CONSTRAINT "DataRefs_mapConfigId_fkey" FOREIGN KEY ("mapConfigId") REFERENCES "public"."MapConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_mapConfigId_fkey" FOREIGN KEY ("mapConfigId") REFERENCES "public"."MapConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
