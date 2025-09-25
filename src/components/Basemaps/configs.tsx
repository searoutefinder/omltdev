import { BasemapConfigTypes, BasemapsConfigTypesFC } from './types';
import { LineWidths, SelectedLineColors, PreserveLabelSizes, idMap } from './PreserveMap/styleExpressions';

export const basemapsTrailMaps = [
  //Light Style 
  'mapbox://styles/ezwear1/cm27tcoxd00fp01pi8dpd3erf',
  //Green Style 
  'mapbox://styles/ezwear1/cm4lkrcba000x01r3au4j1x15',
  //Satellite Style 
  'mapbox://styles/ezwear1/cm4uetucp004r01s1gdv7gg48'
];

export const basemapsWalkMaps = [
  //Outdoors style is used in WalkMap
  'mapbox://styles/ezwear1/cmc34kcfe00ow01s99jwm743u',
  //Green Style is used in WalkMap
  'mapbox://styles/ezwear1/cm4lkrcba000x01r3au4j1x15',
  //Satellite Style is used in WalkMap
  'mapbox://styles/ezwear1/cm4uetucp004r01s1gdv7gg48'
];

export const basemapsRisingRoutes = [
  'mapbox://styles/ezwear1/cm9d717en00h901sb7jc31iva',
]



//======= BASEMAPS CONFIGS
export const basemapsConfig = (mapStyle: string, isMobile: boolean, id: number | null): BasemapConfigTypes => {
  const lineWidth = isMobile ? LineWidths.base.mobile : LineWidths.base.desktop;
  const highlightWidth = isMobile ? LineWidths.highlight.mobile : LineWidths.highlight.desktop;
  const selectedColor = isMobile ? SelectedLineColors.mobile : SelectedLineColors.desktop;
  const labelSize = isMobile ? PreserveLabelSizes.mobile : PreserveLabelSizes.desktop;

  const commonAmenities = {
    parkingSymbolURL: '/img/raster/Map/parking-symbol.png',
    preserveSymbolURL: id ? idMap[id] : '/img/raster/Map/Three_Sisters.png',
    kioskSymbolURL: 'kiosk'
  };

  const commonDistanceLabels = {
    textColor: "#242323",
    haloColor: "#ffffff",
    haloBlur: 1,
    haloWidth: 0.5
  };

  const commonDonation = {
    donationIconURL: '/img/raster/Map/DonationPin.png',
    donationTextURL: '/img/raster/Map/DonationPinText.png'
  };

  const commonPOIs = {
    textColor: "#646464",
    textHaloWidth: 1,
    textHaloColor: "#ffffff",
    textHaloBlur: 1
  };

  const commonPOIsPngs = {
    seatingUrl: '/img/raster/Map/POIs/Seating.png',
    waterfallUrl: '/img/raster/Map/POIs/Waterfall.png',
    viewpointUrl: '/img/raster/Map/POIs/Viewpoint.png',
    structureUrl: '/img/raster/Map/POIs/Structure.png',
    obstructionUrl: '/img/raster/Map/POIs/Obstruction.png',
    defaultPOIURL: '/img/raster/Map/POIs/Default.png'
  };

  const satellitePOIsPngs = {
    seatingUrl: '/img/raster/Map/POIs/Satellite/Seating.png',
    waterfallUrl: '/img/raster/Map/POIs/Satellite/Waterfall.png',
    viewpointUrl: '/img/raster/Map/POIs/Satellite/Viewpoint.png',
    structureUrl: '/img/raster/Map/POIs/Satellite/Structure.png',
    obstructionUrl: '/img/raster/Map/POIs/Satellite/Obstruction.png',
    defaultPOIURL: '/img/raster/Map/POIs/Satellite/Default.png'
  };

  const kioskPngs = {
    defaultKioskUrl: '/img/raster/Map/POIs/Kiosk.png'
  };

  const satelliteKioskPngs = {
    defaultKioskUrl: '/img/raster/Map/POIs/Satellite/Kiosk.png'
  };  

  const configs: BasemapsConfigTypesFC = {
    // Outdoors style – used in WalkMap
    'mapbox://styles/ezwear1/cmc34kcfe00ow01s99jwm743u': {
      name: 'Outdoors',
      trailBase: { lineWidth },
      trailShading: {
        selected: selectedColor,
        unSelected: "rgba(207, 225, 237, .6)",
        lineBlur: 1,
        lineWidth: highlightWidth
      },
      preserve: {
        lineColor: ["interpolate", ["linear"], ["zoom"], 5, "rgba(0,0,0,0.45)", 13, "rgba(61,61,61,0.09)"],
        lineWidth: ["interpolate", ["linear"], ["zoom"], 0, 3, 11, 3.5, 22, 4.5],
        glowColor: ["interpolate", ["linear"], ["zoom"], 12, "rgba(194,194,194,0.1)", 22, "rgba(194,194,194,0.25)"],
        glowWidth: ["interpolate", ["linear"], ["zoom"], 0, 2, 11, 5, 22, 15],
        glowBlur: 0.8,
        glowOffset: ["interpolate", ["linear"], ["zoom"], 0, 0, 11, 3, 22, 5],
        fillColor: ["interpolate", ["linear"], ["zoom"], 0, "rgba(0,0,0,1)", 10, "rgba(87,87,87,0.09)"],
        textSize: labelSize
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
      amenitiesPngs: commonAmenities,
      distanceLabels: commonDistanceLabels,
      donationPngs: commonDonation,
      pois: commonPOIs,
      poisPngs: commonPOIsPngs,
      kioskPngs: kioskPngs
    },

    // Light style – used in TrailMap
    'mapbox://styles/ezwear1/cm27tcoxd00fp01pi8dpd3erf': {
      name: 'Light',
      trailBase: { lineWidth },
      trailShading: {
        selected: selectedColor,
        unSelected: "rgba(207, 225, 237, .6)",
        lineBlur: 1,
        lineWidth: highlightWidth
      },
      preserve: {
        lineColor: ["interpolate", ["linear"], ["zoom"], 5, "rgba(0,0,0,0.45)", 13, "rgba(61,61,61,0.09)"],
        lineWidth: ["interpolate", ["linear"], ["zoom"], 0, 3, 11, 3.5, 22, 4.5],
        glowColor: ["interpolate", ["linear"], ["zoom"], 12, "rgba(194,194,194,0.1)", 22, "rgba(194,194,194,0.25)"],
        glowWidth: ["interpolate", ["linear"], ["zoom"], 0, 2, 11, 5, 22, 15],
        glowBlur: 0.8,
        glowOffset: ["interpolate", ["linear"], ["zoom"], 0, 0, 11, 3, 22, 5],
        fillColor: ["interpolate", ["linear"], ["zoom"], 0, "rgba(0,0,0,1)", 10, "rgba(87,87,87,0.09)"],
        textSize: labelSize
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
      amenitiesPngs: commonAmenities,
      distanceLabels: commonDistanceLabels,
      donationPngs: commonDonation,
      pois: commonPOIs,
      poisPngs: commonPOIsPngs,
      kioskPngs: kioskPngs
    },

    // Green style – used in TrailMap & WalkMap
    'mapbox://styles/ezwear1/cm4lkrcba000x01r3au4j1x15': {
      name: 'Green',
      trailBase: { lineWidth },
      trailShading: {
        selected: selectedColor,
        unSelected: "rgba(207, 225, 237, 0.692)",
        lineBlur: 1,
        lineWidth: highlightWidth
      },
      preserve: {
        lineColor: ["interpolate", ["linear"], ["zoom"], 5, "rgba(213,136,48,0.5)", 13, "rgb(213,136,48)"],
        lineWidth: ["interpolate", ["linear"], ["zoom"], 0, 2, 11, 2, 22, 3],
        glowColor: ["interpolate", ["linear"], ["zoom"], 12, "rgba(213,136,48,0.1)", 22, "rgba(213,136,48,0.48)"],
        glowWidth: ["interpolate", ["linear"], ["zoom"], 0, 2, 11, 5, 22, 15],
        glowBlur: 0.8,
        glowOffset: ["interpolate", ["linear"], ["zoom"], 0, 0, 11, 3, 22, 5],
        fillColor: ["interpolate", ["linear"], ["zoom"], 5, "rgb(213,136,48)", 10, "rgba(213,136,48,0.2)", 15, "rgba(213,136,48,0.05)", 18, "rgba(213,136,48,0)"],
        textSize: labelSize
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
      amenitiesPngs: commonAmenities,
      distanceLabels: commonDistanceLabels,
      donationPngs: commonDonation,
      pois: commonPOIs,
      poisPngs: commonPOIsPngs,
      kioskPngs: kioskPngs
    },

    // Satellite style – used in TrailMap & WalkMap
    'mapbox://styles/ezwear1/cm4uetucp004r01s1gdv7gg48': {
      name: 'Satellite',
      trailBase: { lineWidth },
      trailShading: {
        selected: selectedColor,
        unSelected: "rgba(205, 224, 236, 0.280)",
        lineBlur: 0.5,
        lineWidth: highlightWidth
      },
      preserve: {
        lineColor: ["interpolate", ["linear"], ["zoom"], 5, "rgba(213,136,48,0.5)", 13, "rgb(213,136,48)"],
        lineWidth: ["interpolate", ["linear"], ["zoom"], 0, 2, 11, 2, 22, 3],
        glowColor: ["interpolate", ["linear"], ["zoom"], 12, "rgba(213,136,48,0.1)", 22, "rgba(213,136,48,0.48)"],
        glowWidth: ["interpolate", ["linear"], ["zoom"], 0, 2, 11, 5, 22, 15],
        glowBlur: 0.8,
        glowOffset: ["interpolate", ["linear"], ["zoom"], 0, 0, 11, 3, 22, 5],
        fillColor: ["interpolate", ["linear"], ["zoom"], 5, "rgb(213,136,48)", 10, "rgba(213,136,48,0.2)", 15, "rgba(213,136,48,0.05)", 18, "rgba(213,136,48,0)"],
        textSize: labelSize
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
        ...commonAmenities,
        parkingSymbolURL: '/img/raster/Map/parking-symbol-white.png',
        kioskSymbolURL: 'kiosk_white'
      },
      distanceLabels: {
        textColor: "#ffffff",
        haloColor: "#3d3d3d",
        haloBlur: 1,
        haloWidth: 1
      },
      donationPngs: {
        ...commonDonation,
        donationTextURL: '/img/raster/Map/DonationPinText-satellite.png'
      },
      pois: {
        textColor: "#ffffff",
        textHaloWidth: 1,
        textHaloColor: "#7c7d7e",
        textHaloBlur: 1
      },
      poisPngs: satellitePOIsPngs,
      kioskPngs: satelliteKioskPngs
    }
  };

  return configs[mapStyle];
};
