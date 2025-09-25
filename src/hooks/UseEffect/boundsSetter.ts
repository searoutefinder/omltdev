import { useEffect, useRef } from "react";
import { optimizationConfigs, MobileConfigs } from "../../configs/preserveMaps";

interface BoundsSetterProps {
    mapInstance: mapboxgl.Map | null;
    styleLoaded: boolean;
    delay?: number;
    setBounds: (b: mapboxgl.LngLatBounds) => void;
}

export const BoundsSetter = ({
    mapInstance,
    styleLoaded,
    delay = optimizationConfigs.delayMove,
    setBounds,
}: BoundsSetterProps) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!styleLoaded || !mapInstance) return;

        // debounced handler
        const handleMoveEnd = () => {
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                const zoom = mapInstance.getZoom();
                if (zoom < MobileConfigs.minZoomBboxWorker) return;
                setBounds(mapInstance.getBounds() as mapboxgl.LngLatBounds);
            }, delay);
        };

        // subscribe / unsubscribe
        mapInstance.on("moveend", handleMoveEnd);

        // cleanup
        return () => {
            mapInstance.off("moveend", handleMoveEnd);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [styleLoaded,
        mapInstance,
        delay,
        setBounds]);
    return null;
};
