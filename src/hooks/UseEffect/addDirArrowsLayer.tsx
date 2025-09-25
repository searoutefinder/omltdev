//Add dir arrows layer when map is idle to prevent 
//quering elevation data using mapbox tilequery api

import { useEffect, MutableRefObject } from "react";
//types
import { FeatureCollection, LineString, GeoJsonProperties } from "geojson";
//fncs
import { calculateDirectionByElevation } from '../../utils/setDirectsByElevation';
import { BasemapConfigTypes } from "@/components/Basemaps/configs";



//define interface
interface AddDirArrowsLayerProps {
  mapInstance: mapboxgl.Map | null;
  dataLoaded: boolean;
  styleLoaded: boolean;
  geojsonTrailsRef: MutableRefObject<FeatureCollection<LineString> | null>;
  currentTheme: BasemapConfigTypes;
};


export const AddDirArrowsLayer = ({
  mapInstance,
  dataLoaded,
  geojsonTrailsRef,
  styleLoaded,
  currentTheme,
}: AddDirArrowsLayerProps) => {

  useEffect(() => {
    if (!dataLoaded 
        || !styleLoaded 
        || !mapInstance 
        || !currentTheme
        || !geojsonTrailsRef.current ) return;

      addDirArrowsLayer(mapInstance, geojsonTrailsRef.current, currentTheme);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleLoaded, currentTheme, dataLoaded, geojsonTrailsRef]);

  return null;
};


export const addDirArrowsLayer = async (map: mapboxgl.Map, geojson: FeatureCollection<LineString, GeoJsonProperties>, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !map || !geojson) return;

  const dataWithDirection = await calculateDirectionByElevation({ mapInstance: map, geojson: geojson });

  if (!dataWithDirection) return;

  //add source
  if (!map.getSource("dir_arrows-source")) {
    map.addSource("dir_arrows-source", {
      type: "geojson",
      data: dataWithDirection,
    });
  };

  //4. add directional arrows
  if (!map.getLayer("dir_arrows")) {
    map.addLayer({
      "id": "dir_arrows",
      "type": "symbol",
      "source": "dir_arrows-source",
      "minzoom": 12,
      "filter": [
        "match",
        [
          "get",
          "direction"
        ],
        [ 
          "Downhill Only",
          "Uphill Only"
        ],
        true,
        false
      ],
      "layout": {
        "text-allow-overlap": true,
        "icon-offset": [
          0,
          -16.5
        ],
        "icon-image": "dir_arrow_test",
        "symbol-avoid-edges": true,
        "symbol-spacing": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          50,
          16,
          150,
          22,
          350
        ],
        "icon-allow-overlap": true,
        "symbol-placement": "line",
        "icon-rotate": [
          "match",
          ["get", "directionByElevation"],
          "uphill", 180,
          0
        ],

        "icon-size": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          0.15,
          15,
          0.35,
          22,
          0.45
        ],
        "icon-padding": 0,
        "icon-ignore-placement": true
      },
      "paint": {
        "text-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          0.8,
          18,
          0.9,
          22,
          1
        ],
        "icon-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          0.8,
          18,
          0.9,
          22,
          1
        ]
      },
    })
    map.moveLayer('dir_arrows', 'continent-label');
  };

  return () => {
    if (map.getLayer("dir_arrows")) map.removeLayer("dir_arrows");
    if (map.getSource("dir_arrows-source")) map.removeSource("dir_arrows-source");
  };
};


