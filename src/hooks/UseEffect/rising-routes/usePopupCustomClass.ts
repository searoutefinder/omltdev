import { useEffect} from 'react';
import mapboxgl from 'mapbox-gl';

interface UsePopUpRefProps {
    mapInstance: React.MutableRefObject<mapboxgl.Map | null>;
    popupRef: React.MutableRefObject<mapboxgl.Popup | null>;
    className: string;
}
    

export const usePopupCustomClass = ({ mapInstance, popupRef, className }: UsePopUpRefProps) => {
    
    useEffect(() => {
        if (!popupRef.current && mapInstance.current) {
            popupRef.current = new mapboxgl.Popup({
                className: className,
                closeButton: false,
                closeOnClick: true,
                anchor: 'bottom',
                offset: 62,
            });
        }
    }, [
        mapInstance,
        popupRef,
        className
    ]);
}