import { useEffect, useRef } from 'react';
import {Bbox} from '../../types/preserve-map';

interface FitMapToBoundsProps {
  mapInstance: mapboxgl.Map | null;
  bbox: Bbox;
  promotion: boolean;
  styleLoaded: boolean;
  dataLoaded: boolean;
}

export const FitMapToBounds = ({ mapInstance, bbox, promotion, styleLoaded, dataLoaded }: FitMapToBoundsProps) => {
  const hasFitted = useRef(false);

  useEffect(() => {
    if (styleLoaded && !hasFitted.current && mapInstance && dataLoaded && bbox && !promotion) {    
      mapInstance.fitBounds(
        bbox,
        { 
          padding: { 
            top: 100, 
            bottom: 100, 
            left: 80, 
            right: 80 
          }, 
          duration: 400, 
          minZoom: 11.35 // - min zoom for boox worker   
        }
      );
      hasFitted.current = true;
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleLoaded, bbox, dataLoaded]);

  return null;
 };
