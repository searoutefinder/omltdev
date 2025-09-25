import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection, Point} from 'geojson';
import { showPopup } from '../../../utils/RisingRoutes/index';

interface Props {
  mapInstance: mapboxgl.Map | null;
  popupRef: React.MutableRefObject<mapboxgl.Popup | null>;
  //geojson data
  data: FeatureCollection<Point> | null;
  selectedFeatureId: number | null;
  isMobile: boolean;
  filteredIds?: number[];
  setSelectedId?: (id: number | null) => void;
}

export const useBounceMarker = ({
  mapInstance,
  popupRef,
  data,
  selectedFeatureId,
  isMobile,
  filteredIds,
  setSelectedId
}: Props) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

 
  useEffect(() => {
    if (!mapInstance || !data || selectedFeatureId == null) 
        return;

      if (!filteredIds?.includes(selectedFeatureId)) {
    setSelectedId?.(null);
    return;
  };

    //1.find the feature with geometry and type Point    
    const feat = data.features.find(f => f.id === selectedFeatureId);
    
    if (!feat || feat.geometry.type !== 'Point') return;

    //2. remove previous marker if exists
    markerRef.current?.remove();

    //* DOM
    //outer and inner divs
    const outer = document.createElement('div');
    outer.className = 'wiggle-outer';

    const inner = document.createElement('div');
    inner.className = 'wiggle-inner';
    outer.appendChild(inner);

  
    //marker 
    markerRef.current = new mapboxgl.Marker({ element: outer, anchor: 'bottom' })
      .setLngLat(feat.geometry.coordinates as [number, number])
      .addTo(mapInstance);

      showPopup({
        mapInstance,
        popupRef: popupRef,
        feature: feat,
        isMobile
      });
     
      //cleanups 
     return () => { markerRef.current?.remove(); };
  
  }, [mapInstance,
     popupRef, 
     data, 
     filteredIds,
     selectedFeatureId, 
     isMobile, 
     setSelectedId]);
};
