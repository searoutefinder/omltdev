import {useEffect, MutableRefObject} from 'react';
import {MultiPolygon, Polygon, FeatureCollection} from 'geojson';
import {BasemapConfigTypes} from '../../Basemaps/types';

interface AddLayersProps { 
  isMobile: boolean;      
  mapInstance: mapboxgl.Map | null;
  dataLoaded: boolean;
  styleLoaded: boolean;
  geojsonPreserveRef: MutableRefObject<FeatureCollection<MultiPolygon | Polygon> | null>;
  currentTheme: BasemapConfigTypes;
  setLayersLoaded: (layersLoaded: boolean) => void;    
}



export const AddLayers = ({ 
    isMobile,
    mapInstance,
    dataLoaded,
    styleLoaded,
    geojsonPreserveRef,
    currentTheme,
    setLayersLoaded
}:AddLayersProps) => { 
    
    useEffect(() => {
        if ( !dataLoaded 
            || !styleLoaded 
            || !mapInstance 
            || !geojsonPreserveRef.current) return;
        
        addPreserveLayer(mapInstance, geojsonPreserveRef.current, isMobile, currentTheme);
        setLayersLoaded(true);
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataLoaded, 
        styleLoaded, 
        geojsonPreserveRef, 
        isMobile]);

    return null;
}


export const addPreserveLayer = async (map: mapboxgl.Map, geojson: any | null, isMobile: boolean, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || geojson === null || !map) return;
  
  const geojsonData = geojson;

  //add sources
  if (!map.getSource("preserve-source")) {
    map.addSource("preserve-source", {
      type: "geojson",
      data: geojsonData,
    });
  };



  //1.add boundary 
  if (!map.getLayer("preserve-boundary")) {
    map.addLayer({
      id: "preserve-boundary",
      type: "line",
      source: "preserve-source",
      paint: {
        "line-color": currentTheme.preserve.lineColor,
        "line-width": currentTheme.preserve.lineWidth,
        "line-blur": 1,
      },
    });
  }

  //2.add inner glow 
  if (!map.getLayer("preserve-glow")) {
    map.addLayer({
      id: "preserve-glow",
      type: "line",
      minzoom: 12,
      source: "preserve-source",
      "paint": {
        "line-color": currentTheme.preserve.glowColor,
        "line-width": currentTheme.preserve.glowWidth,
        "line-blur": currentTheme.preserve.glowBlur,
        "line-offset": currentTheme.preserve.glowOffset
      },
    });
  }

  //3.add fill 
  if (!map.getLayer("preserve-fill")) {
    map.addLayer({
      id: "preserve-fill",
      type: "fill",
      source: "preserve-source",
      "paint": {
        "fill-color": currentTheme.preserve.fillColor,
        "fill-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11,
          1,
          22,
          0.25
        ],
        "fill-outline-color": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11,
          "#ababab",
          22,
          "#b1afaf"
        ]
      },
    });


    //4. add preserve label
    if (!map.getLayer("preserve-label")) {
      map.addLayer({
        "minzoom": 12,
        "type": "symbol",
        "source": "preserve-source",
        "id": "preserve-label",
        "paint": {
          "text-color": "#949699",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
          "text-halo-blur": 1
        },
        "layout": {
          "text-size": currentTheme.preserve.textSize,
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "text-transform": "uppercase",
          "text-padding": 
            ["interpolate",
              [
                "linear"
              ],
              [
                "zoom"
              ],
              12, 0,
              15, 220,
              22,400
            ],
          "text-font": [
            "Red Hat Display Bold",
            "Arial Unicode MS Regular"
          ],
          "text-offset": [
            0,
            -0.2
          ],
          "text-field": [
            "to-string",
            [
              "get",
              "preserve_name"
            ]
          ],
          "text-letter-spacing": [
            "interpolate",
            [
              "linear"
            ],
            [
              "zoom"
            ],
            14,
            0,
            22,
            0
          ]
        }
      });

    }

    const baseLayer = currentTheme.name === 'Satellite'
      ? 'admin-1-boundary-bg'
      : 'building';

    map.moveLayer('preserve-fill', baseLayer);
    map.moveLayer('preserve-glow', baseLayer);
    map.moveLayer('preserve-boundary', baseLayer);
    map.moveLayer('preserve-label', baseLayer);
  };

  return () => {
    if (map.getLayer("preserve-boundary")) map.removeLayer("preserve-boundary");
    if (map.getLayer("preserve-glow")) map.removeLayer("preserve-glow");
    if (map.getLayer("preserve-fill")) map.removeLayer("preserve-fill");
    if (map.getLayer("preserve-label")) map.removeLayer("preserve-label");
    if (map.getSource("preserve-source")) map.removeSource("preserve-source");
    if (map.getSource("preserve-label-source")) map.removeSource("preserve-label-source");
  };
};