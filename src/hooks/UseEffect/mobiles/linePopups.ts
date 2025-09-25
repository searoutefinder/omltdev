// LinePopupOnZoom.tsx
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { useEffect, useRef} from "react";
import { PopupDataItem } from "../../../types/preserve-map";
import { getPopUpStyleTrails } from "../../../utils/Popup/PopUpTrails";
import { MobileConfigs, optimizationConfigs } from "../../../configs/preserveMaps";

interface LinePopupOnZoomProps {
  mapInstance: mapboxgl.Map | null;
  styleLoaded: boolean;
  activePreserve: string | null;
  popupData: PopupDataItem[] | null;
  bounds: mapboxgl.LngLatBounds | null;
  zoomLevel: number;
  isMobile: boolean;
  isCollapsedLeft: boolean;
  setSelectedTrailId: (selectedTrailId: number | null) => void;
  setOpenItemIndex: (openItemIndex: number | null) => void;
  setIsCollapsedLeft: (collapsed: boolean) => void;
}

export const LinePopupOnZoom = ({
  mapInstance,
  styleLoaded,
  activePreserve,
  popupData,
  bounds,
  zoomLevel,
  isMobile,
  isCollapsedLeft,
  setSelectedTrailId,
  setOpenItemIndex,
  setIsCollapsedLeft,
}: LinePopupOnZoomProps) => {
  
  
  const popupsRef = useRef<mapboxgl.Popup[]>([]);



  useEffect(() => {
    if (!mapInstance 
      || !styleLoaded 
      || !isMobile 
      || !bounds) return;

    
    if (popupData?.length === 0 || !activePreserve)  {
        popupsRef.current.forEach((popup) => popup.remove());
        popupsRef.current = [];
        return;
    };

    
    if (zoomLevel < optimizationConfigs.popupCleanups) {
      popupsRef.current.forEach((popup) => popup.remove());
      popupsRef.current = [];
      return;
    };
    
    // map popup data to the map
    popupData?.forEach(({ featureId, popupCoordinates, name }) => {
      const numericTrailId = typeof featureId === "number" ? featureId : null;
      popupCoordinates.forEach((coord: LngLatLike) => {
        if (!bounds.contains(coord)) return;

        const existingPopup = Array.from(
          document.querySelectorAll(".mapboxgl-popup-content")
        ).find((p) => p.textContent?.includes(name || ""));
        if (existingPopup) return;

        const handleSvgClick = (e: Event) => {
          e.stopPropagation();
          setSelectedTrailId(numericTrailId);
          setOpenItemIndex(numericTrailId);
          if (isCollapsedLeft) {
            setIsCollapsedLeft(!isCollapsedLeft);
          }
        };

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: true,
          offset: [0, -3],
        })
          .setLngLat(coord)
          .setHTML(getPopUpStyleTrails(name || "", isMobile))
          .on("open", () => {
            const popupContainer = popup.getElement();
            if (popupContainer) {
              const eventElement = isMobile ? "#Container" : "img";
              const imgElement = popupContainer.querySelector(eventElement);
              if (imgElement) {
                imgElement.addEventListener("click", handleSvgClick);
              }
            }
          })
          .on("close", () => {
            const popupContainer = popup.getElement();
            if (popupContainer) {
              const imgElement = popupContainer.querySelector("img");
              if (imgElement) {
                imgElement.removeEventListener("click", handleSvgClick);
              }
            }
          });

        if (zoomLevel >= MobileConfigs.minZoomPopUpWorker) {
          popupsRef.current.push(popup);
          popup.addTo(mapInstance);
        }
      });
    });


    return () => {
      popupsRef.current.forEach((popup) => popup.remove());
      popupsRef.current = [];
    };
  }, [
    isMobile,
    styleLoaded,
    activePreserve,
    popupData,
    mapInstance,
    zoomLevel,
    isCollapsedLeft,
    bounds,
    setSelectedTrailId,
    setOpenItemIndex,
    setIsCollapsedLeft,
  ]);

  return null;
};
