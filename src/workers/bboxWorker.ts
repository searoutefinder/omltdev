import * as turf from "@turf/turf";
import { Bbox, Point } from "../types/preserve-map";
import { MobileConfigs, optimizationConfigs  } from "../configs/preserveMaps";

let BboxesMap: Record<string, Bbox> = {};
const preserveCenters = new Map<string, Point >();   // ← cache
let lastMatchedBBox: string | null = null;

// --------------------- CONFIG ------------------------//
//#fix add for desktop and mobiles
const maxNullDistanceFromPreserves = optimizationConfigs.maxNullDistanceFromPreserves;


// ------------------------ EVENTS------------------------//
self.onmessage = (e: MessageEvent) => {

  //revice data from main thread
  if (e.data.type === "setBBoxes") {
    BboxesMap = e.data.bboxes;

    // cache each preserve centre once
    preserveCenters.clear();
    for (const [name, bbox] of Object.entries(BboxesMap)) {
      preserveCenters.set(name, getBBoxCenter(bbox).geometry.coordinates as Point);
    }
  }

  // get closest matching preserve
  if (e.data.type === "checkBBox") {
    const {zoomLevel, center } = e.data;
    const matchedPreserve = getClosestMatchingPreserve(zoomLevel, center);

    if (!matchedPreserve) {
        lastMatchedBBox = null;
        self.postMessage({ type: "update", matchedPreserve: null });
      return;
    }
    
    if (matchedPreserve !== lastMatchedBBox 
        && matchedPreserve !== null
      ) {
      lastMatchedBBox = matchedPreserve;
      self.postMessage({ type: "update", matchedPreserve });
      return;
    }
  }
};

// -------------------- FUNCTIONS ---------------------//
function getClosestMatchingPreserve(
  zoomLevel: number,
  center: [number, number],// current map center
): string | null {
  if (zoomLevel < MobileConfigs.minZoomBboxWorker) return null;


  let nearest: string | null = null;
  let bestDist = Infinity;

  for (const [name, bbox] of Object.entries(BboxesMap)) {
    if (isCenterInsideBBox(center, bbox)) return name;

    // distance between area centres (m)
    const d = turf.distance(center, preserveCenters.get(name)!, {
      units: "meters",
    });

    if (d < bestDist) {
      bestDist = d;
      nearest  = name;
    }
  }

  return bestDist <= maxNullDistanceFromPreserves ? nearest : null;
}

// true iff [lng,lat] is inside bbox
function isCenterInsideBBox(
  [lng, lat]: [number, number],
  bbox: Bbox,
): boolean {
  return (
    lng >= bbox[0][0] &&
    lng <= bbox[1][0] &&
    lat >= bbox[0][1] &&
    lat <= bbox[1][1]
  );
}

// calculate BBox-a center
function getBBoxCenter(bbox: Bbox) {
  const centerLng = (bbox[0][0] + bbox[1][0]) / 2;
  const centerLat = (bbox[0][1] + bbox[1][1]) / 2;
  return turf.point([centerLng, centerLat]);
}
