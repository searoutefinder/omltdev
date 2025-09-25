import { LineString, MultiLineString, FeatureCollection, Feature } from "geojson";

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

// type LineCoordinates = [number, number][];
// type MultiLineCoordinates = [number, number][][];

export type LineOrMultiLineString = LineString | MultiLineString;


export interface GeoJsonFeature extends Feature<LineOrMultiLineString> {
    id: string | number;
    properties: {
        id: number;
        name: string;
    };
};

export interface SidebarDataProps {
    id: string | number;
    name: string;
    description: string;
    segment: string;
    distance: number;
}




//#Tamas 8: I cleaned this up a bit, removed unused fields and added segment field and removed few functions that were not needed. I ommited max grade function too. 
//also this is the component where you need to calculate distance : see how i did it in "original" component. so, I derived this one from here [src\utils\preserve-map\getSidebarData.ts]

export const getSidebarData = (
  geoJson: FeatureCollection<LineOrMultiLineString>,
): SidebarDataProps[] => {
  if (!geoJson || !Array.isArray(geoJson.features)) return [];

  // ─── 0. helpers ───────────────────────────────────────────
  //#Tamas 8.1 - If i remember, this map exists because some column names in the feature hosted layer did not match what was defined in the left sidebar (UI).
  //[UPDATE] - yes, that was a case. I just renamed description to descriptio, because ESRI doesn't allow more that 10 characters in field names sometimes (nevermind for now).
  //later we you define data model you can do it in better way, but for now this is a quick fix.
  
  const fieldMap = {
    id: "id",
    name: "name",
    descriptio: "description",
    distance: "distance",
    segment: "segment",
  } as const;

  const usedIds      = new Set<number>();          
  const distanceMap  = new Map<number, number>();  // id → total distance

  // ─── 1. build aggregate maps (single pass) ───────────────
  for (const f of geoJson.features) {
    const props = f.properties;
    if (!props) continue;
    const id = f.id as number;

    // distance sum
    const d = props.distance ?? 0;
    distanceMap.set(id, +((distanceMap.get(id) ?? 0) + d).toFixed(2));

  }

  
  // ─── 2. filter by bbox & de-dup ids ──────────────────────
  const filtered = geoJson.features.filter((f) => {
    const id = f.id as number;
    if (usedIds.has(id)) return false;
    usedIds.add(id);
    return true;
  });


  // ─── 3. map to sidebar rows ──────────────────────────────

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
      out.distance    = distanceMap.get(id)  ?? 0;

      return out as SidebarDataProps;
    })
    .filter(Boolean) as SidebarDataProps[];
};
