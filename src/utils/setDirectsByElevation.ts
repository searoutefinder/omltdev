import { FeatureCollection, LineString, MultiLineString } from "geojson";

interface ElevationDirectionProps {
  mapInstance: mapboxgl.Map | null;
  geojson: FeatureCollection<LineString | MultiLineString>;
}

/**
 * Tries to fetch terrain elevation repeatedly until
 *  - a valid value is returned, or
 *  - the retry limit is reached.
 */
async function retryElevation(
  map: mapboxgl.Map,
  lngLat: [number, number],
  maxRetries = 10,
  delayMs = 200
): Promise<number | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const elev = map.queryTerrainElevation(lngLat);
    if (elev !== null && elev !== undefined) {
      return elev;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  // If no elevation was found within maxRetries, return null
  return null;
}

export const calculateDirectionByElevation = async ({
  mapInstance,
  geojson
}: ElevationDirectionProps) => {
  if (!mapInstance || !geojson) return;

  if (!mapInstance.getTerrain()) {
    console.error("Terrain is not enabled. Set a terrain source before querying elevation.");
    return;
  }

  for (const feature of geojson.features) {
      
    //1.define start and end point
    let startPoint: [number, number];
    let endPoint:   [number, number];

    if (feature.geometry.type === "LineString") {
      const coords = feature.geometry.coordinates as [number, number][];
      startPoint = coords[0];
      endPoint   = coords[coords.length - 1];

    } else if (feature.geometry.type === "MultiLineString") {
      const coords = feature.geometry.coordinates as [number, number][][];
      startPoint = coords[0][0];
      const lastLine = coords[coords.length - 1];
      endPoint   = lastLine[lastLine.length - 1];

    } else {
      continue;
    }
    
    //2.query elevation
    const startElevation = await retryElevation(mapInstance, startPoint);
    const endElevation   = await retryElevation(mapInstance, endPoint);

    //ensure elevation data is available  
    if (startElevation === null || endElevation === null) {
      if (feature.properties) {
        feature.properties.directionByElevation = "unknown";
      }
      continue;
    }

    //3.determine direction by elevation
    let direction = "both";
    if (endElevation > startElevation) {
      direction = "uphill";
    } else if (endElevation < startElevation) {
      direction = "downhill";
    }

    // 4) add direction to properties
    if (feature.properties) {
      feature.properties.directionByElevation = direction;
    }
  }

  // console.log("geojson with directions:", geojson);
  return geojson;
};
