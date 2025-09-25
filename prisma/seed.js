/* eslint-env node */
import prisma from "../lib/prisma.js";



//SEED TEMPLATE FOR #ALL TEMPLATES - Dashboard
async function main() {

  const ORG_ID = "TkSpD6kCAXkp8Jk5";
  const SERVICE = "LGLC_OMLT";
  
  //===== 1) Organization (by slug) — keep orgId
  const org = await prisma.organization.upsert({
    where: { slug: "LGLC" },
    update: { orgId: "TkSpD6kCAXkp8Jk5" },
    create: {
      slug: "LGLC",
      orgId: "TkSpD6kCAXkp8Jk5", // AGOL orgId
      name: "Lake George Land Conservancy",
    },
  });

  // ====== 2) MapConfig (by orgId + serviceName) — keep orgId, serviceName
  // helper: mapping all scalar fields (incl. bbox) from our config object
  const mkFields = (slug, cfg) => ({
    // identity
    organizationId: org.id,
    orgId: ORG_ID,
    serviceName: SERVICE,
    slug,

    // meta
    promotion: !!cfg.promotion,
    webMapName: cfg.webMapName ?? null,
    owner: cfg.owner ?? null,
    logoURL: cfg.logoURL ?? null,
    contactEmail: cfg.email ?? null,
    cityAndState: cfg.cityAndState ?? null,

    // camera
    centerLng: cfg.center[0],
    centerLat: cfg.center[1],
    zoom: cfg.zoom ?? 14,
    pitch: cfg.pitch ?? 0,
    bearing: cfg.bearing ?? 0,
    minZoom: cfg.minZoom ?? 10,
    maxZoom: cfg.maxZoom ?? 18,
    maxPitch: cfg.maxPitch ?? 70,

    // donations
    donationLng: cfg.donationPinCoords?.[0] ?? null,
    donationLat: cfg.donationPinCoords?.[1] ?? null,

    // BBOX (if exists)
    bboxMinLng: cfg.bbox ? cfg.bbox[0][0] : null,
    bboxMinLat: cfg.bbox ? cfg.bbox[0][1] : null,
    bboxMaxLng: cfg.bbox ? cfg.bbox[1][0] : null,
    bboxMaxLat: cfg.bbox ? cfg.bbox[1][1] : null,
  });

  // helper: dataRefs payload
  const mkDataRefs = () => ({
    //#Improvements - LGLC client- find dynamically based on order
    masterTable:  5,
    preserve:     3,
    trails:       2,
    pois:         1,
    trailheads:   0,
    parkingLots:  4,
    distances:     null,
    trailSourceName: "trails-source",
    mainSource: {},
  });


  // 2) data lglc preserves (with bboxes)
  const preserves = {
    SchumannPreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[-73.61729,43.46723], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.6304, 43.4573], [-73.6047, 43.4751]],
    },
    SchumannPreserve3D: {
      promotion:true, cityAndState:"Fort Ann, NY",
      center:[-73.6171345851022,43.46662609427642], zoom:14.1, pitch:41, bearing:32.2, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.6304, 43.4573], [-73.6047, 43.4751]],
    },
    ThePinnaclePreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[-73.67758,43.556577], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.690, 43.54485], [-73.66796, 43.56983]],
    },
    BerryPondPreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[-73.75763,43.40135], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.8014, 43.3775], [-73.7135, 43.4242]],
    },
    PeggysPoint: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.7450749,-73.4969596], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.498036, 43.744275], [-73.495964, 43.745538]],
    },
    LeemingJelliffePreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.655792,-73.490481], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.493157, 43.65251], [-73.488038, 43.6579]],
    },
    GodwinPreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.633178,-73.652584], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.658846, 43.629262], [-73.647211, 43.635993]],
    },
    TerzianWoodlotPreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.678529,-73.517310], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.521373, 43.673201], [-73.512775, 43.682863]],
    },
    AnthonysNosePreserve: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.771863,-73.460716], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.471711, 43.768123], [-73.447766, 43.775752]],
    },
    CookMountain: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.817343,-73.446024], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.454005, 43.811368], [-73.435367, 43.819617]],
    },
    PoleHillPond: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.623369,-73.632015], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.652307, 43.60042], [-73.610485, 43.63599]],
    },
    SuckerBrook: {
      promotion:false, cityAndState:"Fort Ann, NY",
      center:[43.750062,-73.449876], zoom:14, pitch:0, bearing:0, minZoom:10, maxZoom:18, maxPitch:70,
      donationPinCoords:[0,0],
      bbox: [[-73.463452, 43.73123], [-73.430901, 43.766741]],
    },
    
    // walkmaps: {
    //   promotion:false, cityAndState:"Saranac Lake, NY",
    //   center:[-74.13261610157, 44.3270], zoom:15, pitch:0, bearing:0, minZoom:2, maxZoom:18, maxPitch:70,
    //   donationPinCoords:[0,0],
    //   bbox: [[-73.135858, 44.3229], [-74.149876, 44.330784]],
    //   webMapName: "River Walk"
    // },
  };

  // 3) SOFT OVERWRITE — upsert + UPDATE svih polja; dataRefs upsert
  for (const [slug, cfg] of Object.entries(preserves)) {
    await prisma.mapConfig.upsert({
      where: { orgId_serviceName_slug: { orgId: ORG_ID, serviceName: SERVICE, slug } },
      update: {
        ...mkFields(slug, cfg),
        dataRefs: {
          upsert: {
            update: mkDataRefs(),
            create: mkDataRefs(),
          },
        },
      },
      create: {
        ...mkFields(slug, cfg),
        dataRefs: { create: mkDataRefs() },
      },
    });
    console.log(`✔ upserted ${slug}`);
  }

  console.log("Seed complete ✅");

  // helper za kod
const toIconCode = (name) =>
  String(name || "")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

// ime iz AGOL -> url
const POINTER_ICON_URLS = {
  "Three Sisters":                   "/img/raster/Map/Pointers/Three_Sisters.png",
  "Berry Pond Preserve":             "/img/raster/Map/Pointers/Berry_Pond_Preserve.png",
  "Schumann Preserve":               "/img/raster/Map/Pointers/Schumann_Preserve.png",
  "The Pinnacle Preserve":           "/img/raster/Map/Pointers/The_Pinnacle_Preserve.png",
  "Anthony's Nose Preserve":         "/img/raster/Map/Pointers/Anthonys_Nose_Preserve.png",
  "Cook Mountain":                   "/img/raster/Map/Pointers/Cook_Mountain.png",
  "Godwin Preserve":                 "/img/raster/Map/Pointers/Godwin_Preserve.png",
  "Leeming Jelliffe Preserve":       "/img/raster/Map/Pointers/Leeming_Jelliffe_Preserve.png",
  "Peggy's Point":                   "/img/raster/Map/Pointers/Peggys_Point.png",
  "Pole Hill Pond":                  "/img/raster/Map/Pointers/Pole_Hill_Pond.png",
  "Sucker Brook":                    "/img/raster/Map/Pointers/Sucker_Brook.png",
  "Terzian Woodlot Preserve":        "/img/raster/Map/Pointers/Terzian_Woodlot_Preserve.png",
};



// soft-overwrite po datasetu
for (const [label, url] of Object.entries(POINTER_ICON_URLS)) {
  const code = toIconCode(label); // npr. "Schumann_Preserve"

  // pokušaj naći postojeći zapis za isti dataset/kind/code
  const existing = await prisma.image.findFirst({
    where: {
      orgId: ORG_ID,
      serviceName: SERVICE,
      kind: "preserve-pointer",
      iconCode: code,
    },
  });

  if (existing) {
    await prisma.image.update({
      where: { id: existing.id },
      data: { url, name: label, active: true, tags: { label } },
    });
  } else {
    await prisma.image.create({
      data: {
        orgId: ORG_ID,
        serviceName: SERVICE,
        kind: "preserve-pointer",
        name: label,
        iconCode: code,
        url,
        tags: { label },
        active: true,
      },
    });
  }
}
console.log("✔ images upserted by dataset (trailhead-pointer)");

}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error("Seed error ❌", e); process.exit(1); });
