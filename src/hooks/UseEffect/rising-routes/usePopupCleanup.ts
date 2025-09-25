import { useEffect, useRef} from 'react';


interface PopupCleanUpProps {
    styleLoaded: boolean;
    popupRef: any;
    selectedId : number | null;
};


export const usePopupCleanup = ({
  styleLoaded,
  popupRef,
  selectedId,
}: PopupCleanUpProps) => {
  
 const prevSelectedId = useRef<number | null>(null);

  useEffect(() => {
    if (!styleLoaded) return;

    const hasJustBeenCleared = prevSelectedId.current !== null && selectedId === null;

    if (hasJustBeenCleared && popupRef.current) {
      popupRef.current.remove?.(); 
      const popups = document.querySelectorAll('.mapboxgl-popup');
      popups.forEach(popup => popup.remove());
    }

    prevSelectedId.current = selectedId;
  }, [selectedId, 
      styleLoaded, 
      popupRef]);
};
  