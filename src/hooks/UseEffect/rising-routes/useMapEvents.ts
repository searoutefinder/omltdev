import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import { getPopUpStylePoints } from '../../../utils/Popup/PopUpPoints';

interface Props {
  mapInstance: mapboxgl.Map | null;
  styleLoaded: boolean;
  isMobile: boolean;
  sourceId: string;
  layerId: string;   // base id
  layerId2: string;  // clusters
  layerId3: string;  // cluster-count
  popupRef: React.MutableRefObject<mapboxgl.Popup | null>;
  setSelectedFeatureId: (id: number | null) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useMapEvents = ({
  mapInstance,
  styleLoaded,
  isMobile,
  sourceId,
  layerId,
  layerId2,
  layerId3,
  popupRef,
  setSelectedFeatureId,
  setIsOpen
}: Props) => {

  useEffect(() => {
    if (!mapInstance || !styleLoaded) return;

    const popup = popupRef.current;
    const SYMBOL = `${layerId}-unselected`;          

    const padding = isMobile ? undefined : { 
       left: 450, 
       top: 0, 
       right: 0, 
       bottom: 0 };


    /*1. click on marker */
    const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f) return;

      setSelectedFeatureId(f.id as number);
      setIsOpen(true);

      if (popup) { 
        popup
        .setLngLat((f.geometry as any).coordinates as [number, number])
        .setHTML(getPopUpStylePoints({ feature: f, isMobile }))
        .addTo(mapInstance);
      }
     
    };

    /*2. click on clusters */
    const handleClusterClick = (e: mapboxgl.MapLayerMouseEvent) => {
      const cluster = mapInstance.queryRenderedFeatures(e.point, { layers: [layerId2] })[0];
      if (!cluster) return;

      const clusterId = cluster.properties?.cluster_id;
      const src = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource;
      src.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        mapInstance.easeTo({
          center: (cluster.geometry as any).coordinates,
          zoom: zoom ?? undefined,
          padding,
        });
      });
    };

    const enter = () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    };

    const leave = () => {
      mapInstance.getCanvas().style.cursor = '';
    };
    
    //---------------EVENTS------------------
    // 3. add event listeners
    // symbols
    mapInstance.on('click', SYMBOL, handleClick);
    mapInstance.on('mouseenter', SYMBOL, enter);
    mapInstance.on('mouseleave', SYMBOL, leave);
    // clusters
    mapInstance.on('click', layerId2, handleClusterClick);
    mapInstance.on('mouseenter', layerId2, enter);
    mapInstance.on('mouseleave', layerId2, leave);
    // cluster-count
    mapInstance.on('mouseenter', layerId3, enter);
    mapInstance.on('mouseleave', layerId3, leave);

    // clean-ups
    return () => {
       if (popup) {
        popup.remove();
      }
      //symbols
      mapInstance.off('click', SYMBOL, handleClick);
      mapInstance.off('mouseenter', SYMBOL, enter);
      mapInstance.off('mouseleave', SYMBOL, leave);
      //clusters
      mapInstance.off('click', layerId2, handleClusterClick);
      mapInstance.off('mouseenter', layerId2, enter);
      mapInstance.off('mouseleave', layerId2, leave);
      //cluster-count
      mapInstance.off('mouseenter', layerId3, enter);
      mapInstance.off('mouseleave', layerId3, leave);
    };
  }, [
    mapInstance,
    styleLoaded,
    isMobile,
    sourceId,
    layerId,
    layerId2,
    layerId3,
    popupRef,
    setSelectedFeatureId,
    setIsOpen,

  ]);

  return null;
};
