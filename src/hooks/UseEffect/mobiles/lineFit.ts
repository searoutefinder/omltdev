import { useEffect } from "react";
import { bbox as turfBBox, multiLineString } from "@turf/turf";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import type { Map as MapboxMap } from "mapbox-gl";

interface useLineFitProps {
  mapInstance: MapboxMap | null;
  selectedTrailId: number | null;
  isMobile: boolean;
  geojson: FeatureCollection<Geometry> | null;
}

export const LineFit = ({ mapInstance, selectedTrailId, isMobile, geojson }: useLineFitProps) => {
  useEffect(() => {
    
    if (!mapInstance 
        || !isMobile 
        || selectedTrailId === null 
        || !geojson ) return;

    try {
      //find all features with the selected trail id - if multi part exists, combine them
      const features = geojson.features.filter(
        (f: Feature) => f.id === selectedTrailId
      );

      if (features.length === 0) return;

      const coords: number[][][] = [];

      for (const f of features) {
        if (f.geometry.type === "LineString") {
          coords.push(f.geometry.coordinates as number[][]);
        } else if (f.geometry.type === "MultiLineString") {
          coords.push(...(f.geometry.coordinates as number[][][]));
        }
      }

      const geom = multiLineString(coords);
      const [minX, minY, maxX, maxY] = turfBBox(geom);

      mapInstance.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
        }
      );
    } catch (err) {
      console.error("line bbox fit error", err);
    }
  }, [mapInstance, 
      geojson, 
      isMobile, 
      selectedTrailId]);
};
