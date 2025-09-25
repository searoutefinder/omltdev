
import { BasemapConfigTypes } from "../../Basemaps/types";
import { FeatureCollection, LineString, GeoJsonProperties, MultiLineString, Point } from "geojson";
import { getDonationData } from "../../../utils/getDonationData";
import { getDistanceData } from "../../../utils/LabelPlacement/getDistanceData";
import { getLongestSideOffsetLines } from "../../../utils/LabelPlacement/getPreserveData";
import { loadImageAsync } from "../../../utils/loadImageForLib";



export const addPreserveLayer = async (map: mapboxgl.Map, geojson: any | null, isMobile: boolean, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || geojson === null || !map) return;
  //dynamic data

  const geojsonData = geojson;
  const preserveLabelData = getLongestSideOffsetLines({ geojson: geojsonData, isMobile: isMobile });
  
  //add sources
  if (!map.getSource("preserve-source")) {
    map.addSource("preserve-source", {
      type: "geojson",
      data: geojsonData,
    });
  }

  if (!map.getLayer("preserve-label-source")) {
    map.addSource("preserve-label-source", {
      type: "geojson",
      data: preserveLabelData,
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
        "minzoom": 11.5,
        "type": "symbol",
        "source": "preserve-label-source",
        "id": "preserve-label",
        "paint": {
          "text-color": "#949699",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
          "text-halo-blur": 1
        },
        "layout": {
          "text-size": currentTheme.preserve.textSize,
          "text-allow-overlap": true,
          "text-ignore-placement": false,
          "symbol-avoid-edges": true,
          "text-transform": "uppercase",
          "text-padding": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 550,
            22, 800
          ],
          "text-font": [
            "Red Hat Display Bold",
            "Arial Unicode MS Regular"
          ],
          "symbol-placement": "line-center",
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
  }



  return () => {
    if (map.getLayer("preserve-boundary")) map.removeLayer("preserve-boundary");
    if (map.getLayer("preserve-glow")) map.removeLayer("preserve-glow");
    if (map.getLayer("preserve-fill")) map.removeLayer("preserve-fill");
    if (map.getLayer("preserve-label")) map.removeLayer("preserve-label");
    if (map.getSource("preserve-source")) map.removeSource("preserve-source");
    if (map.getSource("preserve-label-source")) map.removeSource("preserve-label-source");
  }

}


export const addTrailLayer = async (map: mapboxgl.Map, geojson: FeatureCollection<LineString, GeoJsonProperties>, isMobile: boolean, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !map || !geojson) return;

  //add source
  if (!map.getSource("trails-source")) {
    map.addSource("trails-source", {
      type: "geojson",
      data: geojson,
    });
  };

  //1.add trail highlight layer
  if (!map.getLayer("trail-highlight")) {
    map.addLayer({
      id: "trail-highlight",
      type: "line",
      source: "trails-source",
      minzoom: 11,
      layout: {
        "line-cap": "round",
        "line-join": "bevel",
        "line-round-limit": 2
      },
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          currentTheme.trailShading.selected,
          currentTheme.trailShading.unSelected
        ],
        "line-width": currentTheme.trailShading.lineWidth,
        "line-blur": currentTheme.trailShading.lineBlur
      }
    });

    map.moveLayer('trail-highlight', 'continent-label');
  }

  //2.add lines base
  if (!map.getLayer("lines-base")) {
    map.addLayer({
      "id": "lines-base",
      "type": "line",
      "source": "trails-source",
      "minzoom": 11,
      "layout": {
        "line-cap": "round",
        "line-miter-limit": 1.5
      },
      "filter": [
        "==",
        [
          "get",
          "road_segm"
        ],
        0
      ],
      "paint": {
        "line-width": currentTheme.trailBase.lineWidth,
        "line-color": [
          "match",
          [
            "get",
            "activity"
          ],
          [
            "Multi-Use"
          ],
          [
            "match",
            [
              "get",
              "planned_tra"
            ],
            [
              1
            ],
            "rgb(196, 196, 196)",
            "#793c3c"
          ],
          [
            "Mountain-Biking"
          ],
          "#a59b21",
          [
            "Hiking"
          ],
          "#b37127",
          "#ffffff"
        ],
        "line-dasharray": [
          "match",
          [
            "get",
            "activity"
          ],
          ["Multi-Use"],
          [2.2, 1.5],
          ["Mountain-Biking"],
          [1, 0],
          [1, 2]
        ]
      },
    }
    );
    map.moveLayer('lines-base', 'continent-label');
  };

  //3. add lines-base-road segment 
  if (!map.getLayer("lines-base-road-segment")) {
    map.addLayer({
      "id": "lines-base-road-segment",
      "type": "line",
      "source": "trails-source",
      "minzoom": 11,
      "layout": {
        "line-join": "bevel",
        "line-round-limit": 2
      },
      "filter": [
        "==",
        [
          "get",
          "road_segm"
        ],
        1
      ],

      "paint": {
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5,
          0.2,
          10,
          0.65,
          15,
          2
        ],
        "line-dasharray": [
          "step",
          [
            "zoom"
          ],
          [
            "literal",
            [
              2,
              2
            ]
          ],
          12,
          [
            "literal",
            [
              3,
              2
            ]
          ],
          22,
          [
            "literal",
            [
              4,
              2
            ]
          ]
        ],
        "line-blur": 0.5,
        "line-color": "#793c3c"
      },
    }
    );
    map.moveLayer('lines-base-road-segment', 'continent-label');
  }


  //4.add invisible dense trail labels layer - avoid overlapping with countour labels
  if (!map.getLayer("trail-labels-invisible")) {
    map.addLayer({
      id: "trail-labels-invisible",
      type: "symbol",
      source: "trails-source",
      minzoom: 12.88,
      paint: {
        "text-color": "#ffffff",
        "text-opacity": 0
        },
      layout: {
        "symbol-placement": "line",
        "text-field": [
          "to-string",
          [
            "get",
            "trail_name"
          ]
        ],
        "text-max-angle": 360,
        "text-size": 12,
        "symbol-spacing": 20
      },
 
    });
    map.moveLayer('trail-labels-invisible', 'continent-label');
  };


  //5.add trail labels layer
  if (!map.getLayer("trail-labels")) {
    map.addLayer({
      id: "trail-labels",
      type: "symbol",
      source: "trails-source",
      minzoom: 12.88,
      maxzoom: 22,
      paint: {
        "text-halo-width": .5,
        "text-halo-color": currentTheme.trailLabels.haloColor,
        "text-halo-blur": currentTheme.trailLabels.haloBlur,
        "text-color": currentTheme.trailLabels.textColor
      },
      layout: {
        "symbol-placement": "line",
        "text-field": ["get", "trail_name"],
        "text-font": ["Red Hat Display Medium"],
        "text-size": 12,
        "text-max-angle": 55,          
        "text-padding": [
         "interpolate", ["linear"], ["zoom"],
          12,  12,   
          14,  100,    
          16,  180,    
          18,  260     
  ],           
        "text-allow-overlap": false,
        "text-anchor": "center",  
        "text-offset": [0, 0.5],
        "text-rotation-alignment": "map",
      }
      
    });

    map.moveLayer('trail-labels', 'continent-label');
  }

  

  return () => {
    if (map.getLayer("trail-highlight")) map.removeLayer("trail-highlight");
    if (map.getLayer("lines-base")) map.removeLayer("lines-base");
    if (map.getLayer("lines-base-road-segment")) map.removeLayer("lines-base-road-segment");
    if (map.getLayer("trail-labels")) map.removeLayer("trail-labels");
    if (map.getLayer("trail-labels-invisible")) map.removeLayer("trail-labels-invisible");
    if (map.getSource("trails-source")) map.removeSource("trails-source");
  };

};


//trail_heads layer
export const addTrailHeadsLayer = async (map: mapboxgl.Map, geojson: FeatureCollection<Point, GeoJsonProperties> | null, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !geojson || !map) return;
  
  //#fix -1.fetch image from url/DB,  instead of local path
  await loadImageAsync(map, 'Three_Sisters', '/img/raster/Map/Pointers/Three_Sisters.png');
  await loadImageAsync(map, 'Berry_Pond', '/img/raster/Map/Pointers/Berry_Pond_Preserve.png');
  await loadImageAsync(map, 'Schumann', '/img/raster/Map/Pointers/Schumann_Preserve.png');
  await loadImageAsync(map, 'Pinnacle', '/img/raster/Map/Pointers/The_Pinnacle_Preserve.png');
  await loadImageAsync(map, 'Anthonys_Nose_Preserve', '/img/raster/Map/Pointers/Anthonys_Nose_Preserve.png');
  await loadImageAsync(map, 'Cook_Mountain', '/img/raster/Map/Pointers/Cook_Mountain.png');
  await loadImageAsync(map, 'Godwin_Preserve', '/img/raster/Map/Pointers/Godwin_Preserve.png');
  await loadImageAsync(map, 'Leeming_Jelliffe_Preserve', '/img/raster/Map/Pointers/Leeming_Jelliffe_Preserve.png');
  await loadImageAsync(map, 'Peggys_Point', '/img/raster/Map/Pointers/Peggys_Point.png');
  await loadImageAsync(map, 'Pole_Hill_Pond', '/img/raster/Map/Pointers/Pole_Hill_Pond.png');
  await loadImageAsync(map, 'Sucker_Brook', '/img/raster/Map/Pointers/Sucker_Brook.png');
  await loadImageAsync(map, 'Terzian_Woodlot_Preserve', '/img/raster/Map/Pointers/Terzian_Woodlot_Preserve.png');

  await loadImageAsync(map, 'Cat_&_Thomas_Mountains_Preserve', '/img/raster/Map/Pointers/Cat__Thomas_Mountains_Preserve.png');
  await loadImageAsync(map, 'Amys_Park_Preserve', '/img/raster/Map/Pointers/Amys_Park_Preserve.png');

  //#fix- 2.fetch icon-image condiditions from Db/url instead of local path 
  //icon-image []..... 


  if (!map.getSource("trailheads-source")) {
    map.addSource("trailheads-source", {
      type: "geojson",
      data: geojson,
    });
  }

  //#fix -1.fetch image from url/DB,  instead of local path
  if (!map.getLayer("preserve-symbol-lower-layer")) {
    map.addLayer({
      id: "preserve-symbol-lower-layer",
      type: "symbol",
      source: "trailheads-source",
      maxzoom: 11.5,
      layout: {
        "icon-image": [
          "match",
          ["get", "preserve_name"],
          "Three_Sisters", "Three_Sisters",
          "Berry Pond Preserve", "Berry_Pond",
          "Schumann Preserve", "Schumann",
          "The Pinnacle Preserve", "Pinnacle",
          "Anthony's Nose Preserve", "Anthonys_Nose_Preserve",
          "Cook Mountain", "Cook_Mountain",
          "Godwin Preserve", "Godwin_Preserve",
          "Leeming Jelliffe Preserve", "Leeming_Jelliffe_Preserve",
          "Peggy's Point", "Peggys_Point",
          "Pole Hill Pond", "Pole_Hill_Pond",
          "Sucker Brook", "Sucker_Brook",
          "Terzian Woodlot Preserve", "Terzian_Woodlot_Preserve",
          "Cat & Thomas Mountains Preserve", "Cat_&_Thomas_Mountains_Preserve",
          "Amy's Park Preserve", "Amys_Park_Preserve",
          "Three_Sisters"
        ],
        "icon-anchor": "top-left",
        "icon-offset": [
          -0,
          -61
        ],
        "icon-size": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0, 0.5,
          9.8, 1
        ],
        "symbol-placement": "point",

      },
      filter: [
        "match",
        ["get", "category"],
        ["Start"],
        true,
        false
      ],
    });

    map.moveLayer('preserve-symbol-lower-layer', 'continent-label');
  }

  if (!map.getLayer("kiosk-layer")) {
    map.addLayer({
      "id": "kiosk-layer",
      "type": "symbol",
      "source": "trailheads-source",
      "paint": {
        "icon-opacity": 0.85,
        "text-color": "#ffffff"
      },
      "minzoom": 12.88,
      "layout": {
        "text-allow-overlap": true,
        "icon-offset": [
          0,
          0
        ],
        "icon-image": currentTheme.amenitiesPngs.kioskSymbolURL,
        "icon-anchor": "bottom",
        "symbol-avoid-edges": true,
        "text-padding": 0,
        "icon-size": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.88,
          0.55,
          22,
          1
        ],
        "text-anchor": "bottom",
        "text-field": [
          "step",
          [
            "zoom"
          ],
          "",
          13,
          "",
          22,
          ""
        ],
        "icon-padding": 0
      },
      "filter": [
        "match",
        [
          "get",
          "category"
        ],
        [
          "Kiosk"
        ],
        true,
        false
      ],
    });

    map.moveLayer('kiosk-layer', 'continent-label');
  }


  return () => {
    if (map.getLayer("preserve-symbol-lower-layer")) map.removeLayer("preserve-symbol-lower-layer");
    if (map.getLayer("kiosk-layer")) map.removeLayer("kiosk-layer");
    if (map.getSource("trailheads-source")) map.removeSource("trailheads-source");
  };
}


export const addParkingLotsLayer = async (map: mapboxgl.Map, geojson: FeatureCollection<Point, GeoJsonProperties> | null, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !geojson || !map) return;
 
  await loadImageAsync(map, 'parking-symbol', currentTheme.amenitiesPngs.parkingSymbolURL);


  if (!map.getSource("parking_lots-source")) {
    map.addSource("parking_lots-source", {
      type: "geojson",
      data: geojson,
    });
  }

  if (!map.getLayer("parking-icon-layer")) {
    map.addLayer({
      id: "parking-icon-layer",
      type: "symbol",
      source: "parking_lots-source",
      minzoom: 11.5,
      layout: {
        "icon-image": "parking-symbol",
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          12.88,
          0.35,
          22,
          0.88
        ],
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
        "icon-padding": 0
      },
      paint: {
        "icon-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          12.88,
          0.82,
          22,
          1
        ]
      }
    });

    map.moveLayer('parking-icon-layer', 'continent-label');
  }


  return () => {
    if (map.getLayer("parking-icon-layer")) map.removeLayer("parking-icon-layer");
    if (map.getSource("parking_lots-source")) map.removeSource("parking_lots-source");
  };
}



export const addPOILayer = async (map: mapboxgl.Map, geojson: FeatureCollection<Point, GeoJsonProperties> | null, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !geojson || !map) return;

  await loadImageAsync(map, 'Seating', currentTheme.poisPngs.seatingUrl);
  await loadImageAsync(map, 'Waterfall', currentTheme.poisPngs.waterfallUrl);
  await loadImageAsync(map, 'Viewpoint', currentTheme.poisPngs.viewpointUrl);
  await loadImageAsync(map, 'Structure', currentTheme.poisPngs.structureUrl);
  await loadImageAsync(map, 'Obstruction', currentTheme.poisPngs.obstructionUrl);


  if (!map.getSource("pois-source")) {
    map.addSource("pois-source", {
      type: "geojson",
      data: geojson,
    });
  }

  if (!map.getLayer("pois")) {
    map.addLayer({
      "id": "pois",
      "type": "symbol",
      "source": "pois-source",
      "minzoom": 11.5,
      "layout": {
        "icon-size": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          8, 0.1,
          22, 0.3
        ],
        "icon-image": [
          "match",
          ["get", "POI_type"],
          "Seating", "Viewpoint",
          "Waterfall", "Waterfall",
          "View", "Viewpoint",
          "Structure", "Structure",
          "Obstruction", "Obstruction",
          "circle-custom"
        ],
        "icon-allow-overlap": true,
        "icon-padding": 0,
        "symbol-avoid-edges": false,
        "text-allow-overlap": false,
        "text-field": ["get", "POI_name"],
        "text-font": ["Red Hat Display Medium"],
        "text-size": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          8,
          10,
          22,
          16
        ],
        "text-variable-anchor": ["top", "bottom", "left", "right"],
        "text-radial-offset": 0.8,
      },

      "paint": {
        "text-color": currentTheme.pois.textColor,
        "text-halo-width": currentTheme.pois.textHaloWidth,
        "text-halo-color": currentTheme.pois.textHaloColor,
        "text-halo-blur": currentTheme.pois.textHaloBlur
      },
    });

    map.moveLayer('pois', 'continent-label');
  }

  return () => {
    if (map.getLayer("pois")) map.removeLayer("pois");
    if (map.getSource("pois-source")) map.removeSource("pois-source");
  }
}


export const addDistanceLayer = async (
  map: mapboxgl.Map,
  url: string | null | undefined,
  geojson: FeatureCollection<LineString | MultiLineString> | null,
  currentTheme: BasemapConfigTypes
) => {

  if (currentTheme === null || !map) return;

  let data: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

  //for hardcoded for Three Sisters Preserver
  if (url) {
    const response = await fetch(url);
    data = await response.json();
  } else {
    const newData = getDistanceData({ geojson: geojson });
    if (newData === null) return;
    data = newData;
  };


  if (!map.getSource("distances-source")) {
    map.addSource("distances-source", {
      type: "geojson",
      data: data,
    });
  }

  if (!map.getLayer("distances")) {
    map.addLayer({
      id: "distances",
      type: "symbol",
      minzoom: 12.88,
      maxzoom: 17,
      source: "distances-source",
      paint: {
        "text-halo-width": currentTheme.distanceLabels.haloWidth,
        "text-halo-color": currentTheme.distanceLabels.haloColor,
        "text-halo-blur": currentTheme.distanceLabels.haloBlur,
        "text-color": currentTheme.distanceLabels.textColor
      },
      layout: {
        "text-line-height": 1,
        "text-size": [
          "step", ["zoom"],
          8,
          14, 8,
          15, 10,
          16, 12,
          18, 12,
          22, 14
        ],
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-max-angle": 180,
        "text-font": ["Red Hat Display Medium", "Arial Unicode MS Regular"],
        "symbol-placement": "line-center",
        "text-padding": 0,
        "text-anchor": "center",
        "text-field": [
          "case",
          ["==", ["typeof", ["get", "distance"]], "number"],
          ["concat", ["to-string", ["get", "distance"]], " mi"],
          ["to-string", ["get", "distance"]]
        ],
        "text-letter-spacing": 0
      },
    });

    map.moveLayer('distances', 'Property-label');
  }

  return () => {
    if (map.getLayer("distances")) map.removeLayer("distances");
    if (map.getSource("distances-source")) map.removeSource("distances-source");
  };

};


interface AnimationState {
  //global animation state
  isAnimating: boolean;
  lastTime: number;
  animationId: number | null;
  //icon scaling animation
  minScale: number;
  maxScale: number;
  currentScale: number;
  growing: boolean;
  //text offset animation
  minOffset: number;
  maxOffset: number;
  currentOffset: number;
  upSide: boolean;
  //animation MapProperties
  duration: number;
  frameRate: number;
  //layer ids
  iconLayerId: string;
  textLayerId: string;
  //data
  geojson: FeatureCollection<MultiLineString | LineString | Point>;
}

export async function addDonationLayer(map: mapboxgl.Map, geojson: FeatureCollection<LineString | Point, GeoJsonProperties> | null, currentTheme: BasemapConfigTypes) {

  if (currentTheme === null || geojson === null || !map) return;

  const dononationPins = getDonationData({ geojson: geojson });

  if (dononationPins === null) return;

  await loadImageAsync(map, 'donation-icon', currentTheme.donationPngs.donationIconURL);

  if (!map.getSource("donation-icon-source")) {
    map.addSource("donation-icon-source", {
      type: "geojson",
      data: dononationPins as FeatureCollection<Point | MultiLineString | LineString>,
    });
  }

  if (!map.getLayer("donation-icon-layer")) {
    map.addLayer({
      id: "donation-icon-layer",
      type: "symbol",
      source: "donation-icon-source",
      minzoom: 12.88,
      maxzoom: 22,
      layout: {
        "icon-anchor": "bottom",
        "icon-image": "donation-icon",
        "icon-size": [
          "interpolate", ["linear"], ["zoom"],
          12, 0.35,
          15, 0.35 * 1.50,
          22, 0.35 * 3
        ],
        "icon-allow-overlap": true,
      }
    });
  }

  // if (!map.getLayer("donation-text-layer")) {
  //   map.addLayer({
  //     id: "donation-text-layer",
  //     type: "symbol",
  //     source: "donation-icon-source",
  //     minzoom: 12.88,
  //     maxzoom: 22,
  //     layout: {
  //       "icon-anchor": "bottom",
  //       "icon-image": "donation-text",
  //       "icon-size": [
  //         "interpolate", ["linear"], ["zoom"],
  //         12, 0.4,
  //         15, 0.5,
  //         22, 0.6,
  //       ],
  //       "icon-allow-overlap": true,
  //       "icon-offset": [
  //         "interpolate", ["linear"], ["zoom"],
  //         12, ["literal", [0, -72 * 1.15]],
  //         15, ["literal", [0, -72 * 1.25]],
  //         22, ["literal", [0, -72 * 2.15]],
  //       ],
  //     },
  //   });
  // }

  const animationState: AnimationState = {
    //global animation states
    isAnimating: true,
    lastTime: performance.now(),
    animationId: null,
    //icon scaling animation
    currentScale: 0.35,
    minScale: 0.35,
    maxScale: 0.45,
    growing: true,
    //text offset animation
    minOffset: -72,
    maxOffset: -85,
    currentOffset: -72,
    upSide: true,
    //animation MapProperties
    duration: 650,
    frameRate: 50, //30fps
    //layer ids
    iconLayerId: "donation-icon-layer",
    textLayerId: "donation-text-layer",
    geojson: dononationPins as FeatureCollection<MultiLineString | LineString | Point>,
  };

  const cleanup = animateBoth(map, animationState);

  return cleanup;
}



//old one
// function createInterpolateSizeOnZoom(scale: number): mapboxgl.Expression {
//   return [
//     "interpolate", ["linear"], ["zoom"],
//     12, scale,
//     15, scale * 1.25,
//     22, scale * 2.5,
//   ];
// }

// function createInterpolateOffsetOnZoom(offset: number): mapboxgl.Expression {
//   return [
//     "interpolate", ["linear"], ["zoom"],
//     12, ["literal", [0, offset * 1.15]],
//     15, ["literal", [0, offset * 1.25]],
//     22, ["literal", [0, offset * 2.15]],
//   ];
// }

//merge two animations into one
function animateBoth(map: mapboxgl.Map, state: AnimationState) {
  const stepScale = (state.maxScale - state.minScale) / (state.duration / state.frameRate);
  // const stepOffset = (state.maxOffset - state.minOffset) / (state.duration / state.frameRate);

  const animate = (currentTime: number) => {
    if (!state.isAnimating) return null;
    try {
      const deltaTime = currentTime - state.lastTime;
      state.lastTime = currentTime;

      // unload GPU - stop animating if all pins are out of map's current bounds
      const bounds = map.getBounds();
      const zoomLevel = map.getZoom();

      if (zoomLevel < 12.88) {
        // state.animationId = requestAnimationFrame(animate);

        return null;
      };

      const allOutOfBounds = bounds && state.geojson.features.every(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        return (
          typeof lng === 'number' && lng < bounds.getWest() ||
          typeof lng === 'number' && lng > bounds.getEast() ||
          typeof lat === 'number' && lat < bounds.getSouth() ||
          typeof lat === 'number' && lat > bounds.getNorth()
        );
      });

      if (allOutOfBounds) {
        // state.animationId = requestAnimationFrame(animate);
        return null;
      }

      // icon scaling animation
      state.currentScale += state.growing ? (stepScale * (deltaTime / state.frameRate)) : (-stepScale * (deltaTime / state.frameRate));
      if (state.currentScale >= state.maxScale) state.growing = false;
      if (state.currentScale <= state.minScale) state.growing = true;

      // // text offset animation
      // state.currentOffset += state.upSide ? (stepOffset * (deltaTime / state.frameRate)) : (-stepOffset * (deltaTime / state.frameRate));
      // if (state.currentOffset <= state.maxOffset) state.upSide = false;
      // if (state.currentOffset >= state.minOffset) state.upSide = true;

      // if (map.getLayer(state.iconLayerId)) {
      //   map.setLayoutPreserve(
      //     state.iconLayerId,
      //     "icon-size",
      //     createInterpolateSizeOnZoom(state.currentScale) as mapboxgl.ExpressionSpecification
      //   );
      // }

      // if (map.getLayer(state.textLayerId)) {
      //   map.setLayoutPreserve(
      //     state.textLayerId,
      //     "icon-offset",
      //     createInterpolateOffsetOnZoom(state.currentOffset) as mapboxgl.ExpressionSpecification
      //   );
      // }

      // state.animationId = requestAnimationFrame(animate);

    } catch (error) {
      console.warn("Animation stopped due to invalid layer source:", error);
      if (state.animationId)
        cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
  };


  // pause animation when the tab is not visible
  const visibilityChangeHandler = () => {
    if (document.hidden && state.animationId !== null) {
      //stop animation
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    } else if (!document.hidden && state.animationId === null) {
      state.currentScale = state.minScale;
      state.currentOffset = state.minOffset;
      state.lastTime = performance.now();
      state.animationId = requestAnimationFrame(animate);
    }
  };

  //start animation
  document.addEventListener("visibilitychange", visibilityChangeHandler);
  // state.animationId = requestAnimationFrame(animate);

  //cleanup func.
  return () => {
    state.isAnimating = false;
    if (state.animationId !== null) {
      //stop animation
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    };

    document.removeEventListener("visibilitychange", visibilityChangeHandler);

    if (map.getLayer(state.iconLayerId)) map.removeLayer(state.iconLayerId);
    if (map.getLayer(state.textLayerId)) map.removeLayer(state.textLayerId);
    if (map.hasImage("donation-icon")) map.removeImage("donation-icon");
    if (map.hasImage("donation-text")) map.removeImage("donation-text");
    if (map.getSource("donation-icon-source")) map.removeSource("donation-icon-source");
  };
}


