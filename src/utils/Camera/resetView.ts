
interface ResetMapViewProps {
  mapInstance: mapboxgl.Map | null;
  styleLoaded: boolean;
  isCollapsedLeft: boolean;
  isMobile: boolean;
  bbox: [[number, number], [number, number]];
  setIsCollapsedLeft: (value: boolean) => void;
  setIsCollapsedRight: (value: boolean) => void;
  setOpenItemIndex: (value: number | null) => void;
  setSelectedTrailId: (value: number | null) => void;
  handleSidebarToggle: (map: mapboxgl.Map | null, collapsed: boolean, isMobile: boolean) => void;
}



interface ResetMapViewBoundsProps {
  mapInstance: mapboxgl.Map | null;
  styleLoaded: boolean;
}


export const resetView = ({
  mapInstance,
  styleLoaded,
  isCollapsedLeft,
  isMobile,
  bbox,
  setIsCollapsedLeft,
  setIsCollapsedRight,
  setOpenItemIndex,
  setSelectedTrailId,
  handleSidebarToggle }: ResetMapViewProps) => {

  if (mapInstance && styleLoaded) {
    mapInstance.fitBounds(
      bbox,
      {
        padding: { top: 100, bottom: 100, left: 80, right: 80 },
        duration: 550,
        linear: true
      }
    );

    setIsCollapsedLeft(true);
    setIsCollapsedRight(true);
    setOpenItemIndex(null);
    setSelectedTrailId(null);
    if (!isCollapsedLeft) {
      handleSidebarToggle(mapInstance, isCollapsedLeft, isMobile);
    };
  } else return null;
};


export const resetViewBounds = ({
  mapInstance,
  styleLoaded,
   }: ResetMapViewBoundsProps) => {

  if (mapInstance && styleLoaded) {
    mapInstance.flyTo({
      center: [-73.65, 43.55],
      zoom: 11,
      pitch: 0,
      bearing: 0,
    });
  } else return null;
};