import { useEffect} from "react";
import { setupMapEvents } from "../../../components/Events/PreserveMap/setupMapEvents";
import {DonationInfoProps} from "../../../types/preserve-map";

interface AddEventListenersProps { 
    mapInstance: mapboxgl.Map | null;
    source: string;
    hoveredFeatureId: number | null;
    layersLoaded: boolean;
    isMobile: boolean;
    isCollapsedLeft: boolean;
    isCollapsedRight: boolean;
    setIsCollapsedLeft: (collapsed: boolean) => void;
    setIsCollapsedRight: (collapsed: boolean) => void;
    setSelectedTrailId: (selectedTrailId: number | null) => void;
    setOpenItemIndex: (openItemIndex: number | null) => void;
    setDonationInfo: (donationInfo: DonationInfoProps) => void;
}

export const AddEventListeners = ({
       mapInstance,
       source,
       hoveredFeatureId, 
       layersLoaded, 
       isMobile, 
       isCollapsedLeft, 
       isCollapsedRight,
       setIsCollapsedLeft, 
       setIsCollapsedRight, 
       setSelectedTrailId,
       setOpenItemIndex,
       setDonationInfo     
    }:AddEventListenersProps) => { 

useEffect(() => {

        if (layersLoaded && mapInstance) {
        const cleanupFn = setupMapEvents({
          map: mapInstance,
          isMobile,
          source: source,
          layerId: "trail-highlight",
          layerId2: "donation-icon-layer",
          layerId3: "parking-icon-layer",
          layerId4: "preserve-symbol-lower-layer",
          layerId5: "pois",
          hoveredFeatureId: hoveredFeatureId,
          isCollapsedLeft,
          isCollapsedRight,
          setIsCollapsedLeft,
          setSelectedTrailId,
          setOpenItemIndex,
          setIsCollapsedRight,
          setDonationInfo
        });
    
        return () => {
          // console.log("Cleaning up event listeners...");
          if (cleanupFn) cleanupFn();
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [mapInstance,
          isMobile, 
          layersLoaded, 
       ]);

      return null;
}