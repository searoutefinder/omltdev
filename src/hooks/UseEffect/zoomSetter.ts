import { useEffect, useRef } from "react";
import { optimizationConfigs} from "../../configs/preserveMaps";

interface ZoomSetterProps {
    mapInstance: mapboxgl.Map | null;
    styleLoaded: boolean;
    delay?: number;
    setZoomLevel: (zoom: number) => void;
}

export const ZoomSetter = ({
    mapInstance,
    styleLoaded,
    delay = optimizationConfigs.delayMove,
    setZoomLevel,

}: ZoomSetterProps) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!styleLoaded || !mapInstance) return;

        const handleZoomEnd = () => {
            // reset debounce timer
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                const zoom = mapInstance.getZoom();
                setZoomLevel(zoom);
            }, delay);
        };

        // subscribe / unsubscribe
        mapInstance.on("zoomend", handleZoomEnd);

        //cleanup
        return () => {
            mapInstance.off("zoomend", handleZoomEnd);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [styleLoaded,
        mapInstance,
        delay,
        setZoomLevel]);

    return null;
};
