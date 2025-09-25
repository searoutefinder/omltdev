import { useEffect, useRef } from "react";
import { optimizationConfigs, MobileConfigs } from "../../configs/preserveMaps";
import { lngLatEquals, boundsEquals } from "../../utils/Geometry/index";


// ---------- component ----------
interface ViewportSetterProps {
  mapInstance: mapboxgl.Map | null;
  styleLoaded: boolean;
  delay?: number;                        
  setZoomLevel: (zoom: number) => void;
  setBounds:    (bounds: mapboxgl.LngLatBounds) => void;
  setCenter:    (center: mapboxgl.LngLat) => void;
}

export const ViewportSetter = ({
  mapInstance,
  styleLoaded,
  delay = optimizationConfigs.delayMove,
  setZoomLevel,
  setBounds,
  setCenter,
}: ViewportSetterProps) => {
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // REFS -------------------------------------------------------------
  //track last view 
  const lastView = useRef<{
    zoom:   number | null;
    center: mapboxgl.LngLat | null;
    bounds: mapboxgl.LngLatBounds | null;
  }>({ zoom: null, center: null, bounds: null });

  useEffect(() => {
    if (!styleLoaded || !mapInstance) return;

    const updateViewport = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const zoom    = mapInstance.getZoom();
        const center  = mapInstance.getCenter();
        const bounds  = mapInstance.getBounds();

        //1.zoom 
        if (lastView.current.zoom !== zoom) {
          lastView.current.zoom = zoom;
          setZoomLevel(zoom);
        }

        //2.center 
        if (
          !lastView.current.center ||
          !lngLatEquals(lastView.current.center, center)
        ) {
          lastView.current.center = center;
          setCenter(center);
        }

        //3. bounds 
        const prevBounds = lastView.current.bounds;
        let boundsChanged = true;                

        if (prevBounds) {
          boundsChanged = !boundsEquals(prevBounds, bounds as any);
        }

        if (zoom >= MobileConfigs.minZoomBboxWorker && boundsChanged) {
          lastView.current.bounds = bounds;
          setBounds(bounds as any);
        }
      }, delay
    );

    };

    mapInstance.on("idle", updateViewport);
    
    // two cleanups funcs
    return () => {
      mapInstance.off("idle", updateViewport);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [styleLoaded, 
      mapInstance, 
      delay, 
      setZoomLevel, 
      setBounds, 
      setCenter]);

  return null;
};
