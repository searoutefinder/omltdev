//types for congifuring the basemapsTrailMaps style
//global for all basemap styles
export type Expression = mapboxgl.Expression;


type TrailShading = {
  selected: string;
  unSelected: string;
  lineBlur: number;
  lineWidth: Expression
};


type Preserve = {
  lineColor: Expression
  lineWidth: Expression;
  glowColor: Expression;
  glowWidth: Expression;
  glowBlur: number;
  glowOffset: Expression;
  fillColor: Expression;
  textSize: Expression;
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
  lineWidth: Expression;
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
  defaultPOIURL: string;
}

type kioskPngs = {
  defaultKioskUrl: string;
};


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
  kioskPngs: kioskPngs;
} | null;


export type BasemapsConfigTypesFC = {
  [key: string]: BasemapConfigTypes | null;
};