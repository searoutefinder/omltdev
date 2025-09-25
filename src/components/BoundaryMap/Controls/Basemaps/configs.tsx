//Types for congifuring the basemapsTrailMaps style
type expression = mapboxgl.Expression;


type TrailShading = {
  selected: string;
  unSelected: string;
  lineBlur: number;
  lineWidth: expression
};


type Preserve = {
  lineColor: expression
  lineWidth: expression;
  glowColor: expression;
  glowWidth: expression;
  glowBlur: number;
  glowOffset: expression;
  fillColor: expression;
  textSize: expression;
}


type TrailLabels = {
  textColor: string;
  haloColor: string;
  haloBlur: number;
};

type AmenitiesPngs = {
  parkingSymbolURL: string;
  preserveSymbolURL: string;
  kioskSymbolURL: string;
};

type DistanceLabels = {
  textColor: string;
  haloColor: string;
  haloBlur: number;
  haloWidth: number;
};

type DonationPngs = {
  donationIconURL: string;
  donationTextURL: string;
};


type TrailBase = {
  lineWidth: expression;
}

type POIs = { 
  textColor: string;
  textHaloWidth: number;
  textHaloColor: string;
  textHaloBlur: number;
}

type POIsPngs = { 
  seatingUrl: string;
  waterfallUrl: string;
  viewpointUrl: string;
  structureUrl: string;
  obstructionUrl: string;
}


type ContourLabels = {
   textColor: string;
    haloColor: string;
    haloWidth: number;
}

export type BasemapConfigTypes = {
  name: string;
  trailBase: TrailBase
  preserve: Preserve;
  contourLabels: ContourLabels;
  trailShading: TrailShading;
  trailLabels: TrailLabels;
  amenitiesPngs: AmenitiesPngs;
  distanceLabels: DistanceLabels;
  donationPngs: DonationPngs;
  pois: POIs;
  poisPngs: POIsPngs;
} | null;


export type BasemapsConfigTypesFC = {
  [key: string]: BasemapConfigTypes | null;
};


export const basemapsTrailMaps = [
  'mapbox://styles/ezwear1/cm27tcoxd00fp01pi8dpd3erf',
  'mapbox://styles/ezwear1/cm4lkrcba000x01r3au4j1x15',
  'mapbox://styles/ezwear1/cm4uetucp004r01s1gdv7gg48'
];




export const getLineWidthBase = (isMobile: boolean): expression => {
  return isMobile
    ? [
      "interpolate",
      [
        "linear"
      ],
      [
        "zoom"
      ],
      11, 1,
      13, 1.5,
      15, 3
    ]

    : [
      "interpolate",
      [
        "linear"
      ],
      [
        "zoom"
      ],
      11, 1,
      13, 1.5,
      15, 3
    ]
};

export const getLineWidthHighlight = (isMobile: boolean): expression => {
  return isMobile
    ? ["interpolate", ["linear"], ["zoom"],
      10, 4,
      13, 5,
      15, 11]

    : ["interpolate", ["linear"], ["zoom"],
      10, 1.75,
      13, 3,
      15, 11]
};


export const getSelectedLineColor = (isMobile: boolean): string => {
  const color = isMobile ? 
      "rgba(153, 191, 216, .9)"
    : "rgba(153, 191, 216, .55)";
  return color;
};



export const getPreserveLabelSizes = (isMobile: boolean): expression => {
  return isMobile
    ? ["interpolate", ["linear"], ["zoom"], 
      5, 11,
      13, 12,
      14, 12,
      18, 16]

    : ["interpolate", ["linear"], ["zoom"],
      5, 11,
      13, 12,
      14.403, 15,
      18, 15.3]
};



const idMap: { [key: number]: string } = {
  0: '/img/raster/Map/Three_Sisters.png',
  1: '/img/raster/Map/Schumann.png'
};


export const basemapsConfig = (mapStyle: string, isMobile: boolean, id: number | null): BasemapConfigTypes => {
  const configs: BasemapsConfigTypesFC = {
    'mapbox://styles/ezwear1/cm27tcoxd00fp01pi8dpd3erf': {
      name: 'Light',
      trailBase: {
        lineWidth: getLineWidthBase(isMobile),
      },
      trailShading: {
        selected: getSelectedLineColor(isMobile),
        unSelected: "rgba(207, 225, 237, .6)",
        lineBlur: 1,
        lineWidth: getLineWidthHighlight(isMobile)
      },
      preserve: {
        lineColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5,
          "rgba(0, 0, 0, 0.45)",
          13,
          "rgba(61, 61, 61, 0.09)"
        ],
        lineWidth: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          3,
          11,
          3.5,
          22,
          4.5
        ],
        glowColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12,
          "rgba(194, 194, 194, 0.1)",
          22,
          "rgba(194, 194, 194, 0.25)"
        ],
        glowWidth: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          2,
          11,
          5,
          22,
          15
        ],
        glowBlur: 0.8,
        glowOffset: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          0,
          11,
          3,
          22,
          5
        ],
        fillColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          "rgba(0, 0, 0, 1)",
          10,
          "rgba(87, 87, 87, 0.09)"
        ],
        textSize: getPreserveLabelSizes(isMobile),

      },
      contourLabels: {
        textColor: "#a1c0ce",
        haloColor: "hsl(35, 4%, 99%)",
        haloWidth: 1
      },
      trailLabels: {
        textColor: "#242323",
        haloColor: "#ffffff",
        haloBlur: 1
      },
      amenitiesPngs: {
        parkingSymbolURL: '/img/raster/Map/parking-symbol.png',
        preserveSymbolURL: id ? idMap[id] : '/img/raster/Map/Three_Sisters.png',
        kioskSymbolURL: 'kiosk'
      },
      distanceLabels: {
        textColor: "#242323",
        haloColor: "#ffffff",
        haloBlur: 1,
        haloWidth: 0.5
      },
      donationPngs: {
        donationIconURL: '/img/raster/Map/DonationPin.png',
        donationTextURL: '/img/raster/Map/DonationPinText.png'
      }, 
      pois: {
        textColor: "#646464",
        textHaloWidth: 1,
        textHaloColor: "#ffffff",
        textHaloBlur: 1
      }, 

      poisPngs: { 
        seatingUrl: '/img/raster/Map/POIs/Seating.png',
        waterfallUrl:'/img/raster/Map/POIs/Waterfall.png', 
        viewpointUrl: '/img/raster/Map/POIs/Viewpoint.png',
        structureUrl: '/img/raster/Map/POIs/Structure.png',
        obstructionUrl: '/img/raster/Map/POIs/Obstruction.png',
    }
  },

    'mapbox://styles/ezwear1/cm4lkrcba000x01r3au4j1x15': {
      name: 'Green',
      trailBase: {
        lineWidth: getLineWidthBase(isMobile),
      },
      trailShading: {
        selected: getSelectedLineColor(isMobile),
        unSelected: "rgba(207, 225, 237, 0.692)",
        lineBlur: 1,
        lineWidth: getLineWidthHighlight(isMobile)
      },
      preserve: {
        lineColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5,
          "rgba(213, 136, 48, 0.5)",
          13,
          "rgb(213, 136, 48)"
        ],
        lineWidth: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          2,
          11,
          2,
          22,
          3
        ],
        glowColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12,
          "rgba(213, 136, 48, 0.1)",
          22,
          "rgba(213, 136, 48, 0.48)"
        ],
        glowWidth: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          2,
          11,
          5,
          22,
          15
        ],
        glowBlur: 0.8,
        glowOffset: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          0,
          11,
          3,
          22,
          5
        ],
        fillColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5,
          "rgb(213, 136, 48)",
          10,
          "rgba(213, 136, 48, 0.2)",
          15,
          "rgba(213, 136, 48, 0.05)",
          18,
          "rgba(213, 136, 48, 0.00)"
        ],
        textSize: getPreserveLabelSizes(isMobile),
      },
      contourLabels: {
        textColor: "#8c8770",
        haloColor: "#e0e0e0",
        haloWidth: 0.5
      },
      trailLabels: {
        textColor: "#242323",
        haloColor: "#ffffff",
        haloBlur: 1
      },
      amenitiesPngs: {
        parkingSymbolURL: '/img/raster/Map/parking-symbol.png',
        preserveSymbolURL: id ? idMap[id] : '/img/raster/Map/Three_Sisters.png',
        kioskSymbolURL: 'kiosk'
      },
      distanceLabels: {
        textColor: "#242323",
        haloColor: "#ffffff",
        haloBlur: 1,
        haloWidth: 0.5
      },
      donationPngs: {
        donationIconURL: '/img/raster/Map/DonationPin.png',
        donationTextURL: '/img/raster/Map/DonationPinText.png'
      }, 
      pois: {
        textColor: "#646464",
        textHaloWidth: 1,
        textHaloColor: "#ffffff",
        textHaloBlur: 1
      },
      poisPngs: { 
        seatingUrl: '/img/raster/Map/POIs/Seating.png',
        waterfallUrl:'/img/raster/Map/POIs/Waterfall.png', 
        viewpointUrl: '/img/raster/Map/POIs/Viewpoint.png',
        structureUrl: '/img/raster/Map/POIs/Structure.png',
        obstructionUrl: '/img/raster/Map/POIs/Obstruction.png',
    }
    },


    'mapbox://styles/ezwear1/cm4uetucp004r01s1gdv7gg48': {
      name: 'Satellite',
      trailBase: {
        lineWidth: getLineWidthBase(isMobile),
      },
      trailShading: {
        selected: getSelectedLineColor(isMobile),
        unSelected: "rgba(205, 224, 236, 0.280)",
        lineBlur: 0.5,
        lineWidth: getLineWidthHighlight(isMobile)
      },
      preserve: {
        lineColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5,
          "rgba(213, 136, 48, 0.5)",
          13,
          "rgb(213, 136, 48)"
        ],
        lineWidth: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          2,
          11,
          2,
          22,
          3
        ],
        glowColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12,
          "rgba(213, 136, 48, 0.1)",
          22,
          "rgba(213, 136, 48, 0.48)"
        ],
        glowWidth: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          2,
          11,
          5,
          22,
          15
        ],
        glowBlur: 0.8,
        glowOffset: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0,
          0,
          11,
          3,
          22,
          5
        ],
        fillColor: [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5,
          "rgb(213, 136, 48)",
          10,
          "rgba(213, 136, 48, 0.2)",
          15,
          "rgba(213, 136, 48, 0.05)",
          18,
          "rgba(213, 136, 48, 0.00)"
        ],
        textSize: getPreserveLabelSizes(isMobile),

      },
      contourLabels: {
        textColor: "#ffffff",
        haloColor: "#3d3d3d",
        haloWidth: 1
      },
      trailLabels: {
        textColor: "#ffffff",
        haloColor: "#242323",
        haloBlur: 1
      },
      amenitiesPngs: {
        parkingSymbolURL: '/img/raster/Map/parking-symbol-white.png',
        preserveSymbolURL: id ? idMap[id] : '/img/raster/Map/Three_Sisters.png',
        kioskSymbolURL: 'kiosk_white'
      },
      distanceLabels: {
        textColor: "#ffffff",
        haloColor: "#3d3d3d",
        haloBlur: 1,
        haloWidth: 1
      },
      donationPngs: {
        donationIconURL: '/img/raster/Map/DonationPin.png',
        donationTextURL: '/img/raster/Map/DonationPinText-satellite.png'
      }, 
      pois: {
        textColor: "#ffffff",
        textHaloWidth: 1,
        textHaloColor: "#7c7d7e",
        textHaloBlur: 1
      }, 
      poisPngs: { 
        seatingUrl: '/img/raster/Map/POIs/Satellite/Seating.png',
        waterfallUrl:'/img/raster/Map/POIs/Satellite/Waterfall.png', 
        viewpointUrl: '/img/raster/Map/POIs/Satellite/Viewpoint.png',
        structureUrl: '/img/raster/Map/POIs/Satellite/Structure.png',
        obstructionUrl: '/img/raster/Map/POIs/Satellite/Obstruction.png',
    }
    }
  };

  return configs[mapStyle];
};



