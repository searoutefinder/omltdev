import { useEffect } from "react";


interface SetMapIsIdleProps {
    mapInstance: mapboxgl.Map | null;
    styleLoaded: boolean;
    setIsIdle: (isIdle: boolean) => void;
}

export const SetMapIsIdle = ({ mapInstance, styleLoaded, setIsIdle }: SetMapIsIdleProps) => {

    useEffect(() => {
        if (!mapInstance || !styleLoaded) return;

        const handleIdle = (param: boolean) => {
            setIsIdle(param);
        };

        mapInstance.once("idle", () => handleIdle(true));

        return () => {
            mapInstance.off("idle", () => handleIdle(false));
        };
    }, [mapInstance, setIsIdle, styleLoaded]);
};