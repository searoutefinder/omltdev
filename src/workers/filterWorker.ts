/// <reference lib="webworker" />
import { FeatureCollection, Point } from "geojson";
import { uniqueSorted } from "../utils/RisingRoutes";

// -----------------------------------------------------------------------------
//  Cache for features that lives ONLY inside the worker’s thread.
//  It is never cloned back to the main thread.
// -----------------------------------------------------------------------------
let cache: FeatureCollection<Point> | null = null;

//  Unique option lists –- computed once and then reused
let orgTypeOptionsCache: string[] | null = null;
let stateOptionsCache: string[] | null = null;
const cityOptionsCache: Record<string, string[]> = {};  // keyed by state

// -----------------------------------------------------------------------------
// types of messages expected from the main thread
// -----------------------------------------------------------------------------
type WorkerMsg =
  | { type: "setFeatures"; features: FeatureCollection<Point> }
  | { type: "filtering";   filters: any};

// -----------------------------------------------------------------------------
//  Main message handler
// -----------------------------------------------------------------------------

self.onmessage = (e: MessageEvent<WorkerMsg>) => {
  const { type } = e.data;

  //1. receive the full FeatureCollection only ONCE
  if (type === "setFeatures") {
    cache = e.data.features;

    // pre-compute static option lists
    stateOptionsCache = uniqueSorted(cache.features.map(f => f.properties?.state));
    orgTypeOptionsCache = uniqueSorted(cache.features.map(f => f.properties?.organization_type));
    return;                            
  }

  // 2️. filter on every user change –> return ONLY the IDs 
  if (type === "filtering" && cache) {
    const { filters } = e.data;
    // console.log("filtering");
    const { selectedOrgType, selectedCity, selectedState } = filters;
    // collect matching IDs
    const ids: number[] = [];
    for (const f of cache.features) {
      const p = f.properties ?? {};
      if (
        (!selectedState   || p.state === selectedState) &&
        (!selectedCity    || p.city === selectedCity) &&
        (!selectedOrgType || p.organization_type === selectedOrgType)
      ) {
        ids.push(typeof f.id === "number" ? f.id : -1);  // fallback id = -1
      }
    }

    // city options depend on currently selected state - cache per state key
    const cacheKey = selectedState || "__all__";
    if (!cityOptionsCache[cacheKey]) {
      const pool = selectedState
        ? cache.features.filter(f => f.properties?.state === selectedState)
        : cache.features;

      cityOptionsCache[cacheKey] = uniqueSorted(pool.map(f => f.properties?.city));
    }

    //transfer the IDs buffer to avoid an extra clone
    postMessage(
      {
        type: "filteredIds",
        ids,
        filterOptions: {
          orgTypeOptions: orgTypeOptionsCache,
          stateOptions: stateOptionsCache,
          cityOptions: cityOptionsCache[cacheKey] || []
        }
      },
      [new Uint32Array(ids).buffer]       
    );
  }
};
