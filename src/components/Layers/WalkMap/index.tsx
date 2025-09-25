
import { BasemapConfigTypes } from "../../Basemaps/types";
import { FeatureCollection, LineString, GeoJsonProperties, MultiLineString, Point } from "geojson";
import { getDistanceData } from "../../../utils/LabelPlacement/getDistanceData";
import { loadImageAsync } from "../../../utils/loadImageForLib";



//#Tamas 9. - I only loaded and made these two types here visible: lines and points (trail and pois) 
// You can countinue styling the data and writing expressions from here.

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
        "line-join": "round",
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

    
    map.setFilter('road-label', [
      "match",
      ["id"],
      [
        6836115191,
        317489751,
        13207291951,
        1859152681,
        1857250621
      ],
      false,
      true
    ]);
    map.setFilter('road-label', ['!=', ['id'], 317489751]);
    map.setFilter('road-path', [
      "match",
      ["id"],
      [
        457787241, 1552023091, 13207298021, 2551573791, 13207298101, 12053660141, 13207291991, 2551572481, 317489751, 13207291951, 314895201
      ],
      false,
      true
    ]);
    map.setFilter('road-path-bg', [
      "match",
      ["id"],
      [
        457787241, 1552023091, 13207298021, 2551573791, 13207298101, 12053660141, 13207291991, 2551572481, 317489751, 13207291951, 314895201
      ],
      false,
      true
    ]);
           
    
    //map.setFilter('road-path', ["<", ['index-of', ['id'], ["literal", [457787241, 1552023091, 13207298021, 2551573791, 13207298101, 12053660141, 13207291991, 2551572481, 317489751, 13207291951, 314895201]]], 0 ]);
    //map.setFilter('road-path-bg', ["<", ['index-of', ['id'], ["literal", [457787241, 1552023091, 13207298021, 2551573791, 13207298101, 12053660141, 13207291991, 2551572481, 317489751, 13207291951, 314895201]]], 0]);

    map.setLayoutProperty('bridge-path', 'visibility', 'none');
    map.setLayoutProperty('bridge-path-bg', 'visibility', 'none');

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
      "paint": {
        "line-width": currentTheme.trailBase.lineWidth,
        "line-color": '#b37127',
        "line-dasharray": [1, 2]
      },
    }
    );
    map.moveLayer('lines-base', 'continent-label');
  };

  //3. add lines-base-road segment 
  /*if (!map.getLayer("lines-base-road-segment")) {
    map.addLayer({
      "id": "lines-base-road-segment",
      "type": "line",
      "source": "trails-source",
      "minzoom": 11,
      "layout": {
        "line-join": "bevel",
        "line-round-limit": 2
      },
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
        "line-color": "#a8a8a8"
      },
    }
    );
    map.moveLayer('lines-base-road-segment', 'continent-label');
  }*/



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
        "text-field": "Riverwalk path",
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

export const addPOILayer = async (map: mapboxgl.Map, geojson: FeatureCollection<Point, GeoJsonProperties> | null, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !geojson || !map) return;

  await loadImageAsync(map, 'Seating', currentTheme.poisPngs.seatingUrl);
  await loadImageAsync(map, 'Waterfall', currentTheme.poisPngs.waterfallUrl);
  await loadImageAsync(map, 'Viewpoint', currentTheme.poisPngs.viewpointUrl);
  await loadImageAsync(map, 'Structure', currentTheme.poisPngs.structureUrl);
  await loadImageAsync(map, 'Obstruction', currentTheme.poisPngs.obstructionUrl);
  await loadImageAsync(map, 'DefaultPOI', currentTheme.poisPngs.defaultPOIURL);


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
        "icon-image": "DefaultPOI",
        "icon-allow-overlap": false,
        "icon-padding": 0,
        "symbol-avoid-edges": false,
        "text-allow-overlap": false,
        "text-field": ["get", "name"],
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

export const addKioskLayer = async(map: mapboxgl.Map, geojson: FeatureCollection<Point, GeoJsonProperties> | null, currentTheme: BasemapConfigTypes) => {
  if (currentTheme === null || !geojson || !map) return;

  await loadImageAsync(map, 'defaultKioskMarker', currentTheme.kioskPngs.defaultKioskUrl);


  if (!map.getSource("kiosks-source")) {
    map.addSource("kiosks-source", {
      type: "geojson",
      data: geojson,
    });
  }

  if (!map.getLayer("kiosks")) {
    map.addLayer({
      "id": "kiosks",
      "type": "symbol",
      "source": "kiosks-source",
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
          8, 0.3,
          22, 0.5
        ],
        "icon-image": 'defaultKioskMarker',
        "icon-allow-overlap": true,
        "icon-padding": 0,
        "symbol-avoid-edges": false,
        "text-allow-overlap": false,
        "text-field": ["get", "name"],
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

    map.moveLayer('kiosks', 'continent-label');
  }

  return () => {
    if (map.getLayer("kiosks")) map.removeLayer("kiosks");
    if (map.getSource("kiosks-source")) map.removeSource("kiosks-source");
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




