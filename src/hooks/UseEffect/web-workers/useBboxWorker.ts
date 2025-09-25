import { useEffect, useRef } from "react";
import { BboxesMap } from "../../../constants/dataMapping";
import { convertBoundsToBbox } from "../../../utils/Geometry/index";


//interface 
interface UseBboxWorkerProps { 
   styleLoaded: boolean;
   bounds: mapboxgl.LngLatBounds | null;
   center: mapboxgl.LngLat | null;
   zoomLevel: number;
   setActivePreserve: (preserve: string) => void;
   setIsLoading: (loading: boolean) => void;
};

export const UseBboxWorker = ({ 
    styleLoaded, 
    bounds, 
    center,
    zoomLevel, 
    setActivePreserve, 
    setIsLoading }: UseBboxWorkerProps) => {
    const workerRef = useRef<Worker | null>(null);

    //1.worker init only once
    useEffect(() => {
        if (!workerRef.current && styleLoaded) {
            workerRef.current = new Worker(new URL('../../../workers/bboxWorker.ts', import.meta.url), 
            { type: 'module' });

            workerRef.current.onmessage = (e: MessageEvent) => {
                if (e.data.type === 'update') {
                    const detectedPreserve = e.data.matchedPreserve;
                     setIsLoading(true);
                     setActivePreserve(detectedPreserve);
                   
                }
            };
        }

        return () => { 
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, [styleLoaded, 
        setActivePreserve, 
        setIsLoading]);

    //2.send bboxes from main thread to worker thread - only once
    useEffect(() => {
        if (workerRef.current && styleLoaded) {
            workerRef.current.postMessage({ 
                type: 'setBBoxes', 
                bboxes: BboxesMap 
            });
        }
    }, [styleLoaded]);

    //3.send bbox and zoom level to worker thread
    useEffect(() => { 
        if (styleLoaded && workerRef.current && bounds && center) {
            //conversion to plain arrays
            //#fix bounds are redundant here !!
            const bbox = convertBoundsToBbox(bounds);
            const mapCenterCoords = [center.lng, center.lat]; 

            workerRef.current.postMessage({ type: 'checkBBox', 
                bbox: bbox,
                center: mapCenterCoords, 
                zoomLevel: zoomLevel });
        }
    }, [center,
        bounds, 
        zoomLevel, 
        styleLoaded]);

    return null;
};


