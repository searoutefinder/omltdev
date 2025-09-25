import { useEffect, MutableRefObject } from "react";
import { FeatureCollection, LineString, Point, GeoJsonProperties} from "geojson";
import { addDonationLayer} from "../../components/Layers/PreserveMap";
import { BasemapConfigTypes } from "@/components/Basemaps/types";


//define interface
interface AddLayersProps {
  mapInstance: mapboxgl.Map | null;
  dataLoaded: boolean;
  styleLoaded: boolean;
  geojsonTrailsRef: MutableRefObject<FeatureCollection<LineString> | null>;
  geojsonPOIsRef: MutableRefObject<FeatureCollection<Point> | null>;
  donationType: string | null | boolean;
  donationInfo: any;
  currentTheme: BasemapConfigTypes;
};



export const AddDonationLayer = ({ 
  mapInstance, 
  dataLoaded, 
  geojsonTrailsRef, 
  geojsonPOIsRef, 
  donationType,
  donationInfo,
  styleLoaded, 
  currentTheme, 
   }: AddLayersProps) => {

  useEffect(() => {
    if (!dataLoaded 
        || !styleLoaded 
        || !mapInstance 
        || !currentTheme 
      ) return;
      
     if (donationType === null || donationType === false) return;
    
    const matchedFeature = (donationType === "trails")
      ? geojsonTrailsRef.current?.features?.find(
        f => f.properties?.trail_name === donationInfo.donation_object
      )
      : (donationType === "POIs")
      ? geojsonPOIsRef.current?.features?.find(
        f => f.properties?.POI_name === donationInfo.donation_object
        )
      : null;

    const geojson : FeatureCollection<LineString | Point, GeoJsonProperties> | null = matchedFeature
      ? {
        type: "FeatureCollection",
        features: [ matchedFeature ],
      }
      : null;

    if (!geojson) return; 
    addDonationLayer(mapInstance, geojson, currentTheme);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme, 
      styleLoaded, 
      dataLoaded, 
      donationType, 
      geojsonTrailsRef, 
      geojsonPOIsRef,
    ]);

  return null;
}