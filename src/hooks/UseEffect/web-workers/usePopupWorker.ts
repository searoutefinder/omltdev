import { useEffect, useRef} from "react";
import { PopupDataItem } from "../../../types/preserve-map";
import { MobileConfigs } from "../../../configs/preserveMaps";


interface UsePopupWorkerProps { 
  isMobile: boolean;
  geojson: GeoJSON.FeatureCollection | null;
  zoomLevel: number;
  bounds: mapboxgl.LngLatBounds | null;
  activePreserve: string | null;
  setPopupData: (popupData: PopupDataItem[]) => void;
};

export const UsePopupWorker = ({
  isMobile, 
  geojson, 
  zoomLevel,
  bounds,
  activePreserve, 
  setPopupData
}: UsePopupWorkerProps) => {

  const workerRef = useRef<Worker | null>(null);

  
  // 1. init worker only once
  useEffect(() => {
    if (!workerRef.current && isMobile) {
      workerRef.current = new Worker(
        new URL("../../../workers/popupWorker.ts", import.meta.url),
        { type: "module" }
      );
             
      // listen for messages from the worker
      workerRef.current.onmessage = (e: MessageEvent) => {
        if (e.data.type === "processedData" 
            && zoomLevel >= MobileConfigs.minZoomPopUpWorker 
            && activePreserve !== null) {
          setPopupData(e.data.popupData);
        } else {
          setPopupData([]);
        }
      };
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [activePreserve,
      isMobile, 
      zoomLevel, 
      setPopupData]);
      
      

  // 2. send geojson & bounds data to worker when they change
  useEffect(() => {
    if (workerRef.current && 
        isMobile && 
        geojson && 
        bounds && 
        zoomLevel >= MobileConfigs.minZoomPopUpWorker) {
      
        const boundsData = {
        sw: bounds.getSouthWest().toArray(), 
        ne: bounds.getNorthEast().toArray(), 
      };
      // send geojson and bounds data to the worker
      workerRef.current.postMessage({ type: "processLines", geojson, bounds: boundsData });
    }
  }, [geojson, 
      bounds, 
      isMobile,
      zoomLevel]
    ); 

  return null;
};
