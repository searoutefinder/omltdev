import { useEffect, useContext} from "react";
import { setupMapEvents } from "../../../components/Events/WalkMap/setupMapEvents";

// Context
import { PopupContext } from "../../../context/CreateContext";

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
}:AddEventListenersProps) => { 

  const { clickedFeature, setClickedFeature } = useContext(PopupContext);

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
        layerId6: "kiosks",
        hoveredFeatureId: hoveredFeatureId,
        isCollapsedLeft,
        isCollapsedRight,
        setIsCollapsedLeft,
        setSelectedTrailId,
        setOpenItemIndex,
        setIsCollapsedRight,
        clickedFeature,
        setClickedFeature
      });

      return () => {
        // console.log("Cleaning up event listeners...");
        if (cleanupFn) cleanupFn();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 
  [
    mapInstance,
    isMobile, 
    layersLoaded, 
  ]);

  return null;
}