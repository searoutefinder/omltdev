import { useEffect, useRef } from "react";


// interface
interface useLineHighlightProps {
    mapInstance: mapboxgl.Map | null;
    source : string;
    selectedTrailId: number | null;
    layersLoaded: boolean;
  }

export const LineHighlight = ({mapInstance, source, selectedTrailId, layersLoaded} : useLineHighlightProps) => {
    const hoveredFeatureId = useRef<string | number | null>(null);
    
    useEffect(() => {
            if(!layersLoaded || !mapInstance) return;

            if (hoveredFeatureId.current !== null && hoveredFeatureId.current !== selectedTrailId) {
                mapInstance?.setFeatureState({ source: source, id: hoveredFeatureId.current }, { hover: false });
            }
            hoveredFeatureId.current = selectedTrailId;
            if (hoveredFeatureId.current !== null) {
                mapInstance?.setFeatureState({ source: source, id: hoveredFeatureId.current }, { hover: true });
            }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTrailId, layersLoaded]);

    return null;
};