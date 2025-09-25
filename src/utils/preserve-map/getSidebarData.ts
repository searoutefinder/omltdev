import { LineString, MultiLineString, FeatureCollection, Feature } from "geojson";
import { Bbox } from "@/types/preserve-map";
import { isLineWithinBbox } from "../Geometry";
// import { centroid, distance as turDistance } from "@turf/turf";

/** 
 * Transform Geojson data to format for sidebar
 * @param {Object} geoJson
 * @param {Array} bbox
 * @returns {Array}
*/

export interface GeoJson {
    features: LineString;
}

type LineCoordinates = [number, number][];
type MultiLineCoordinates = [number, number][][];

export type LineOrMultiLineString = LineString | MultiLineString;


export interface GeoJsonFeature extends Feature<LineOrMultiLineString> {
    id: string | number;
    properties: {
        id: number;
        name: string;
        description: string;
        activity: string;
        distance: number;
        max_grade: number;
        surface: string;
        road_segm: boolean;
        donation_url: string | null;
    };
};

export interface SidebarDataProps {
    id: string | number;
    trail_name: string;
    description: string;
    activity: string;
    distance: number;
    max_grade: number | null;
    min_width: number | null;
    surface: string;
    road_segm: boolean;
    allowed_acts: string;
    prohibited_acts: string;
    donation_url: string | null;
    donation_text: string | null;
}


export const getSidebarData = (
  geoJson: FeatureCollection<LineOrMultiLineString>,
  bbox: Bbox,
): SidebarDataProps[] => {
  if (!geoJson || !Array.isArray(geoJson.features)) return [];

  // ─── 0. helpers ───────────────────────────────────────────
  const fieldMap = {
    id: "id",
    trail_name: "trail_name",
    description: "description",
    activity: "activity",
    distance: "distance",
    max_grade: "max_grade",
    min_width: "min_width",
    surface: "surface",
    road_segm: "road_segm",
    allowed_acts: "allowed_acts",
    prohibited_acts: "prohibited_acts",
    donation_url: "donation_url",
    donation_text: "donation_text",
  } as const;

  const usedIds      = new Set<number>();          // for bbox filtering
  const distanceMap  = new Map<number, number>();  // id → total distance
  const maxGradeMap  = new Map<number, number>();  // id → max grade

  // ─── 1. build aggregate maps (single pass) ───────────────
  for (const f of geoJson.features) {
    const props = f.properties;
    if (!props) continue;
    const id = f.id as number;

    // distance sum
    const d = props.distance ?? 0;
    distanceMap.set(id, +((distanceMap.get(id) ?? 0) + d).toFixed(2));

    // max grade
    if (props.max_grade != null) {
      const currentMax = maxGradeMap.get(id) ?? Number.NEGATIVE_INFINITY;
      if (props.max_grade > currentMax) maxGradeMap.set(id, props.max_grade);
    }
  }

  // ─── 2. filter by bbox & de-dup ids ──────────────────────
  const filtered = geoJson.features.filter((f) => {
    const id = f.id as number;
    const coords =
      f.geometry.type === "MultiLineString"
        ? (f.geometry.coordinates as MultiLineCoordinates)
        : (f.geometry.coordinates as LineCoordinates);

    if (usedIds.has(id) || !isLineWithinBbox(bbox, coords)) return false;
    usedIds.add(id);
    return true;
  });

  // ─── 3. map to sidebar rows ──────────────────────────────
  const defaultName      = "unknown";
  const defaultMaxGrade  = null;
  const defaultMinWidth  = null;
  const defaultSurface   = "unknown";

  return filtered
    .map((f, idx) => {
      const props = f.properties;
      if (!props) return undefined;

      const out: Partial<SidebarDataProps> = {};

      // copy 1-to-1 fields
      for (const [gKey, sKey] of Object.entries(fieldMap) as [
        keyof typeof fieldMap,
        keyof SidebarDataProps,
      ][]) {
        if (props[gKey] !== undefined) out[sKey] = props[gKey] as any;
      }

      // overrides / aggregates
      const id = f.id as number;
      out.id          = f.id ?? idx + 1;
      out.trail_name  = props.trail_name ?? defaultName;
      out.road_segm   = props.road_segm ?? 0;
      out.max_grade   = maxGradeMap.get(id)  ?? defaultMaxGrade;
      out.min_width   = props.min_width      ?? defaultMinWidth;
      out.surface     = props.surface        ?? defaultSurface;
      out.distance    = distanceMap.get(id)  ?? 0;

      return out as SidebarDataProps;
    })
    .filter(Boolean) as SidebarDataProps[];
};
