import {
    Feature,
    FeatureCollection,
    LineString,
    MultiLineString
  } from "geojson";
  
  import {
    length as turfLength,
    lineString,
    lineSliceAlong,
    simplify as turfSimplify,
  } from "@turf/turf";
  
  interface DistancesDataProps {
    geojson: FeatureCollection<LineString | MultiLineString> | null;
  }
  
  // Constant for your minimum partial length in feet:
  const MIN_LENGTH_FT = 700.0;
  
    /**
     * Get a FeatureCollection<LineString> of partial lines centered at the midpoint
     * of each input LineString or MultiLineString in the input geojson.
     * 
     * @param {DistancesDataProps} geojson - GeoJSON data with LineString or MultiLineString features
     * @returns {FeatureCollection<LineString>} - GeoJSON data with LineString features
     */

  export function getDistanceData({ geojson }: DistancesDataProps) {
    if (!geojson) return null;
  
    const output: FeatureCollection<LineString> = {
      type: "FeatureCollection",
      features: []
    };
  
    for (const feature of geojson.features) {
      // Flatten (Multi)LineString to a single LineString
      const flattened = flattenToSingleLine(feature);
      if (!flattened) continue;
  
      // Measure total length in feet
      const totalFeet = turfLength(flattened, { units: "feet" });
  
      // Skip if the entire line is shorter than MIN_LENGTH_FT
      if (totalFeet < MIN_LENGTH_FT) {
        continue;
      }
  
      // We'll center this partial line at the midpoint
      const halfLen = MIN_LENGTH_FT / 2; // e.g., 350 ft if MIN_LENGTH_FT=700
      const startDist = totalFeet / 2 - halfLen;
      const endDist   = totalFeet / 2 + halfLen;
  
      // Extract using lineSliceAlong
      const partial = lineSliceAlong(
        flattened,
        startDist,
        endDist,
        { units: "feet" }
      );
  
      // Optionally : simplify the partial line to smooth corners
      // Tweak the 'tolerance' as needed
      const simplified = turfSimplify(partial, {
        tolerance: 0.5, // in feet, since we set {units: 'feet'} above
        highQuality: false,
        mutate: false
      });
  
      // THE NEW OFFSET STEP: 
      const offsetVal = 0.00030;
      if (simplified.geometry.type === "LineString") {
        // For every coordinate, subtract 5 from the Y axis
        simplified.geometry.coordinates.forEach(coord => {
          coord[1] -= offsetVal;
        });
      }
  
      // Add the offset partial line to output
      output.features.push({
        type: "Feature",
        geometry: simplified.geometry,
        properties: { distance: feature.properties ? feature.properties.distance : null }
      });
    }
  
    return output;
  }
  
  /**
   * Convert a Feature<LineString|MultiLineString> into a single LineString.
   * If it's a MultiLineString, pick the longest sub‐LineString.
   */
  
  function flattenToSingleLine(
    feature: Feature<LineString | MultiLineString>
  ): Feature<LineString> | null {
    if (!feature.geometry) return null;
  
    if (feature.geometry.type === "LineString") {
      return feature as Feature<LineString>;
  
    } else if (feature.geometry.type === "MultiLineString") {
      let maxLen = 0;
      let bestCoords: number[][] = [];
  
      // Determine which sub‐LineString is longest
      for (const coords of feature.geometry.coordinates) {
        const candidate = lineString(coords);
        const len = turfLength(candidate, { units: "feet" });
        if (len > maxLen) {
          maxLen = len;
          bestCoords = coords;
        }
      };

      // If we didn’t find anything valid
      if (bestCoords.length < 2) return null;
  
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: bestCoords
        },
        properties: { ...feature.properties }
      };
    }
  
    return null;
  }
  