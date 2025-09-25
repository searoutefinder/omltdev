import { createContext, Dispatch, SetStateAction } from "react";
import { Bbox, Point } from '../types/preserve-map';



//MAP CONTEXT ---------------------------------------------------------------------
interface PreserveNameType {
   preserveName: string | null;
   setPreserveName: (value: string) => void;
};


interface SavedContextType {
   isMobile: boolean;
   isIOS: boolean;
   setIsMobile: Dispatch<SetStateAction<boolean>>;
   setIsIOS: Dispatch<SetStateAction<boolean>>;
}

interface PopupContextType {
  clickedFeature: any;
  setClickedFeature: Dispatch<SetStateAction<any>>;
}

export interface MapState {
   id: number | null;
   promotion: boolean;
   webMapName: string | null;
   owner: string | null;
   logoURL: string | null;
   email: string | null;
   cityAndState: string | null;
   center: number[];
   zoom: number;
   pitch: number;
   bearing: number;
   minZoom: number;
   maxZoom: number;
   maxPitch: number;
   bbox: Bbox | boolean | number[][];
   hasTrails?: boolean;
   donationPinCoords: Point | null | number[];   
   dataRefs: {
      masterTable: string | undefined;
      preserve: string | undefined;
      trails: string | undefined;
      trailheads: string | undefined;
      parkingLots: string | undefined;
      pois: string | undefined;
      kiosks: string | undefined;
      distances: null | string;
      images: string[] | null | string;
      trailSourceName: string;
      sourceNames: string[];
   };
   preserveGeojson: any;

}

interface MapContextType {
   mapState: MapState;
   setMapState: Dispatch<SetStateAction<MapState>>;
}


//define context structure and default values ----------------------------------------------
export const PreserveNameContext = createContext<PreserveNameType>({
   preserveName: null,
   setPreserveName: () => { },
});

export const PopupContext = createContext<PopupContextType>({
   clickedFeature: null,
   setClickedFeature: () => {},
});


export const SavedContext = createContext<SavedContextType>({
   isMobile: false,
   isIOS: false,
   setIsMobile: () => { },
   setIsIOS: () => { },
});


export const MapContext = createContext<MapContextType>({
   mapState: {
      id: 0,
      promotion: false,
      webMapName: "",
      owner: null,
      logoURL: null,
      email: null,
      cityAndState: "",
      center: [0, 0],
      zoom: 0,
      pitch: 0,
      bearing: 0,
      minZoom: 0,
      maxZoom: 0,
      maxPitch: 0,
      bbox: false,
      donationPinCoords: [0, 0],      
      dataRefs: {
         masterTable: "",
         preserve: "",
         trails: "",
         trailheads: "",
         parkingLots: "",
         pois: "",
         kiosks: "",
         distances: null,
         images: null,
         trailSourceName: "",
         sourceNames: []
      }, 
      preserveGeojson: null

   },
   setMapState: () => { },
});



//DATA SUBMISSON FORM CONTEXT ---------------------------------------------------------------------

type TemplateProps = {
   id: number;
   name: string;
   value: string;
   validated: boolean;
   status: 'confirmed' | 'not_submitted';
   date: string;
};

export type TemplatesStatus = {
   sessionId: string;
   name: string;
   templates: TemplateProps[];
};


export interface TemplatesStatusContextValue {
   data: TemplatesStatus;
   updateTemplateStatus: (templateId: string, newStatus: 'confirmed' | 'not_submitted') => void;
   updateSessionId: (sessionId: string) => void;
   updateValidated: (templateId: string, validated: boolean) => void;
}

export const TemplatesStatusContext = createContext<TemplatesStatusContextValue>({
   data: {
      sessionId: '',
      name: 'Data Submission Form',
      templates: [
         {
            id: 3,
            name: '',
            value: 'preserves',
            validated: false,
            status: 'not_submitted',
            date: '',
         },
         {
            id: 2,
            name: '',
            value: 'trails',
            validated: false,
            status: 'not_submitted',
            date: '',
         },
         {
            id: 0,
            name: '',
            value: 'trailheads',
            validated: false,
            status: 'not_submitted',
            date: '',
         },
         {
            id: 1,
            name: '',
            value: 'POIs',
            validated: false,
            status: 'not_submitted',
            date: '',
         },
         {
            id: 4,
            name: '',
            value: 'parking_lots',
            validated: false,
            status: 'not_submitted',
            date: '',
         },
      ],
   },
   updateTemplateStatus: () => {},
   updateSessionId: () => {},
   updateValidated: () => {},

});
