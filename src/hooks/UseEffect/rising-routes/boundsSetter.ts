import { useEffect, useCallback, useRef } from 'react';

interface BoundsSetterProps {
    mapInstance: mapboxgl.Map | null;
    styleLoaded: boolean;
    setBounds: (bounds: mapboxgl.LngLatBounds) => void;
}

export const useBoundsSetter = ({
    mapInstance,
    styleLoaded,
    setBounds,
}: BoundsSetterProps) => {
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleBoundsChange = useCallback(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (styleLoaded && mapInstance) {
                const bounds = mapInstance.getBounds();
                setBounds(bounds as mapboxgl.LngLatBounds);
            }
        }, 350);
    }, [styleLoaded, 
        mapInstance,
        setBounds,]);

    useEffect(() => {
        if (styleLoaded && mapInstance) {
            mapInstance.on('moveend', handleBoundsChange);

            return () => {
                mapInstance.off('moveend', handleBoundsChange);
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }
            };
        }
    }, [styleLoaded, 
        mapInstance,
        handleBoundsChange]);

    return null;
};
