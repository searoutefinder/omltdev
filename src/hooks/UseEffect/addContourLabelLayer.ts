import { useEffect, MutableRefObject } from "react";
import { buffer } from '@turf/turf';
//types
import { FeatureCollection, LineString,  GeoJsonProperties, Polygon, MultiPolygon } from "geojson";
import { BasemapConfigTypes } from "@/components/Basemaps/configs";
//fncs
import {polygonsToMultiPolygon } from '../../utils/Geometry/index';



//define interface
interface AddContourLabelsLayerProps {
  mapInstance: mapboxgl.Map | null;
  dataLoaded: boolean;
  styleLoaded: boolean;
  geojsonTrailsRef: MutableRefObject<FeatureCollection<LineString> | null>;
  currentTheme: BasemapConfigTypes;
};


export const AddContourLabelsLayer = ({
  mapInstance,
  dataLoaded,
  geojsonTrailsRef,
  styleLoaded,
  currentTheme,
}: AddContourLabelsLayerProps) => {

  useEffect(() => {
    if (!dataLoaded 
        || !styleLoaded 
        || !mapInstance 
        || !currentTheme
        || !geojsonTrailsRef.current
        ||  currentTheme.name === 'Satellite') return;

    
        addContourLabelsLayer(mapInstance, currentTheme, geojsonTrailsRef.current);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleLoaded, currentTheme, dataLoaded, geojsonTrailsRef]);

  return null;
};


export const addContourLabelsLayer = async (map: mapboxgl.Map, currentTheme: BasemapConfigTypes, geojson: FeatureCollection<LineString, GeoJsonProperties>) => {

    if (!map || currentTheme === null) return null;
  
    //1. Create buffer around the trail for filtering using "within" expression
    const bufferTrails = buffer(geojson, 0.01, {units: 'miles'});
    const multiPolygon = polygonsToMultiPolygon(bufferTrails as FeatureCollection<Polygon | MultiPolygon>);
    // console.log(multiPolygon);

    //add sources
    if (!map.getSource("contour-label-source")) {
      map.addSource("contour-label-source", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });
    };

    if (!map.getSource("trail-buffer-source")) {
        map.addSource("trail-buffer-source", {
            type: "geojson",
            data: multiPolygon,
        });
        }

    if (!map.getLayer("trails-buffer")) {
        map.addLayer({
            "id": "trails-buffer",
            "type": "line",
            "source": "trail-buffer-source",
            "paint": {
            "line-color": "red",
            "line-width": 1, 
            "line-opacity": 0.15          
            },
            "layout": {
            },
        });
    }
  
    if (!map.getLayer("contour-label")) {
      map.addLayer({
        "id": "contour-label",
        "type": "symbol",
        "source": "contour-label-source",
        "source-layer": "contour",
        "paint": {
          "text-color": currentTheme.contourLabels.textColor,
          "text-halo-color": currentTheme.contourLabels.haloColor, 
          "text-halo-width": currentTheme.contourLabels.haloWidth,
        },
        "minzoom": 10.7,
        "layout": {
          "text-field": [
            "concat",
            [
              "to-string",
              [
                "*",
                10,
                [
                  "round",
                  [
                    "/",
                    [
                      "*",
                      [
                        "get",
                        "ele"
                      ],
                      3.28084
                    ],
                    10
                  ]
                ]
              ]
            ],
            "ft (",
            [
              "to-string",
              [
                "*",
                10,
                [
                  "round",
                  [
                    "/",
                    [
                      "get",
                      "ele"
                    ],
                    10
                  ]
                ]
              ]
            ],
            "m)"
          ],
          "text-size": [
            "interpolate",
            [
              "linear"
            ],
            [
              "zoom"
            ],
            15,
            10,
            20,
            14
          ],
          "symbol-placement": "line",
          "text-padding": 50,
          "text-font": [
            "Red Hat Display SemiBold",
            "Arial Unicode MS Regular"
          ],
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
      });
    }

    console.log("Contour label layer added");
  
    //   map.moveLayer("contour-label", "lines-base");
  
    return () => { 
      if (map.getLayer("contour-label")) map.removeLayer("contour-label");
      if (map.getSource("contour-label-source")) map.removeSource("contour-label-source");
      if (map.getLayer("trails-buffer")) map.removeLayer("trails-buffer");
      if (map.getSource("trail-buffer-source")) map.removeSource("trail-buffer-source");
    };
  };


