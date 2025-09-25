import {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  Feature,
  LineString
} from "geojson";

import {
  lineString,
  lineOffset,
  distance as turfDistance,
  area as turfArea
} from "@turf/turf";

interface LongestSideOffsetProps {
  geojson: FeatureCollection<Polygon | MultiPolygon>;
  offsetDistance?: number;  // e.g., meters
  isMobile: boolean;
}

/**
 * Helper: if a feature is MultiPolygon, return the largest polygon (outer ring only).
 */
function largestPolyFromMultiType(
  mp: Feature<MultiPolygon>
): Feature<Polygon> {
  let biggest: number[][][] = mp.geometry.coordinates[0];
  let maxA = 0;

  for (const poly of mp.geometry.coordinates) {
    const a = turfArea({ type: "Polygon", coordinates: poly });
    if (a > maxA) {
      maxA = a;
      biggest = poly;
    }
  }

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: biggest },
    properties: pickPreserveName(mp.properties)
  };
}

/**
 * Produces lines (offset) along either:
 *  - The "northernmost" edge ≥ 550 m, if any
 *  - Or else the single longest edge of the Polygon
 *  - Then ensures it's at least 800 m (if shorter, we scale it)
 */
export function getLongestSideOffsetLines({
  geojson,
  offsetDistance = -30, // default offset in meters,
  isMobile
}: LongestSideOffsetProps): FeatureCollection<LineString> {

  const result: FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features: []
  };

  // console.log('original', geojson);
  for (const feature of geojson.features) {
    if (!feature.geometry) continue;

    let polyFeature: Feature<Polygon> | null = null;

    if (feature.geometry.type === "Polygon") {
      polyFeature = feature as Feature<Polygon>;
    } else if (feature.geometry.type === "MultiPolygon") {
      polyFeature = largestPolyFromMultiType(feature as Feature<MultiPolygon>);
    }

    if (!polyFeature) continue;

    const offsetLine = processSinglePolygon(polyFeature, offsetDistance, isMobile);
    if (offsetLine) result.features.push(offsetLine);
  }
  return result;
}

/**
 * For a single Polygon feature:
 *  1) Identify its outer ring (coords[0]).
 *  2) Among edges, look for any ≥ 550 m. If multiple, pick the highest average Y.
 *  3) If none ≥ 550 m, pick the single longest edge as fallback.
 *  4) Ensure the chosen edge is at least 800 m by scaling if needed.
 *  5) Offset that edge, return as a LineString feature.
 */


function processSinglePolygon(
  polygonFeature: Feature<Polygon>,
  offsetDist: number,
  isMobile: boolean
): Feature<LineString> | null {


  // If the polygon is too small, we can't do anything with it.
  const MIN_POLY_AREA_M2 = 250_000;    
  const polyArea = turfArea(polygonFeature);
  if (polyArea < MIN_POLY_AREA_M2) {
    return null;                        
  };
    

  // If an edge is ≥ 550 m, we consider it for "northern" logic.
  // Then we also ensure the final chosen edge is at least 800 m by scaling.
  const MIN_NORTH_LINE_M = 550;
  const MIN_EXTENDED_LINE_M = isMobile ? 850 : 800;


  // Outer ring
  const coords = polygonFeature.geometry.coordinates;
  if (!coords.length) return null;
  const outerRing = coords[0];
  if (outerRing.length < 2) return null;

  let bestNorthernEdgeAvgY = -Infinity;
  let bestNorthernEdge: [[number, number], [number, number]] | null = null;

  let maxDist = 0;
  let bestFallbackEdge: [[number, number], [number, number]] = [[0, 0], [0, 0]];

  // Loop over consecutive vertices in outerRing
  for (let i = 0; i < outerRing.length - 1; i++) {
    // Force them to [number,number], ignoring alt if present
    const startRaw = outerRing[i];
    const endRaw   = outerRing[i + 1];
    const start: [number, number] = [startRaw[0], startRaw[1]];
    const end:   [number, number] = [endRaw[0], endRaw[1]];

    // Segment length (meters)
    const segDist = turfDistance(start, end, { units: "meters" });

    // Update fallback if it's the longest found
    if (segDist > maxDist) {
      maxDist = segDist;
      bestFallbackEdge = [start, end];
    }

    // Also check if ≥ 550 m for "northern" logic
    if (segDist >= MIN_NORTH_LINE_M) {
      const avgY = (start[1] + end[1]) / 2;
      if (avgY > bestNorthernEdgeAvgY) {
        bestNorthernEdgeAvgY = avgY;
        bestNorthernEdge = [start, end];
      }
    }
  }

  // //for very small polygons, we may not have any edge ≥ 550 m
  // if (!bestNorthernEdge && maxDist < MIN_NORTH_LINE_M) {
  //   return null;  
  // }

  // Decide which edge to use
  let chosenEdge = bestNorthernEdge ?? bestFallbackEdge;

  // Ensure final line is at least 800 m by upscaling if needed
  chosenEdge = ensureMinimumLength(chosenEdge, MIN_EXTENDED_LINE_M);

  // Construct linestring & offset
  const baseLine = lineString(chosenEdge);
  const offsetLine = lineOffset(baseLine, offsetDist, { units: "meters" });
  if (!offsetLine || offsetLine.geometry.type !== "LineString") return null;

  return {
    type: "Feature",
    geometry: offsetLine.geometry,
    properties: { ...polygonFeature.properties }
  };
}

/**
 * If the chosen edge is below 'minMeters', scale it up so it’s ≥ 'minMeters'.
 * Example: If an edge is 500 m long but we need 800 m,
 * we stretch it in the same direction from the first point.
 */
function ensureMinimumLength(
  edge: [[number, number], [number, number]],
  minMeters: number
): [[number, number], [number, number]] {
  const dist = turfDistance(edge[0], edge[1], { units: "meters" });
  if (dist >= minMeters) return edge; // no change needed

  const scale = minMeters / dist;
  const [sx, sy] = edge[0];
  const [ex, ey] = edge[1];
  const dx = ex - sx;
  const dy = ey - sy;
  const newEnd: [number, number] = [sx + dx * scale, sy + dy * scale];
  return [edge[0], newEnd];
}


const pickPreserveName = (props: any) =>
  props?.preserve_name !== undefined ? { preserve_name: props.preserve_name } : {};
