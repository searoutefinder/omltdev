import { Feature } from "geojson";
import { getPopUpStylePoints } from "../Popup/PopUpPoints";


// export const areBoundsEqual = (previous: mapboxgl.LngLatBounds, current: mapboxgl.LngLatBounds) => {
//     //previous bounds
//     const aBounds = previous.getNorthEast();
//     const bBounds = previous.getSouthWest();
//     //current bounds
//     const cBounds = current.getNorthEast();
//     const dBounds = current.getSouthWest();

//     return (
//         aBounds.lng === cBounds.lng &&
//         aBounds.lat === cBounds.lat &&
//         bBounds.lng === dBounds.lng &&
//         bBounds.lat === dBounds.lat
//     )
// };


//helper for sorting, removing duplicates, filtering out nulls and empty strings, and trimming spaces
export function uniqueSorted(arr: (string | null | undefined)[]) {
    return Array.from(
        new Set(
            arr
                .filter((v): v is string => typeof v === 'string' && v.trim() !== '')
                .map((v) => v.trim())
        )
    ).sort((a, b) => a.localeCompare(b));
}



//reusable showPopup function for import as a module
interface PopupProps {
    mapInstance: mapboxgl.Map | null;
    popupRef: React.MutableRefObject<mapboxgl.Popup | null>;
    feature: Feature;
    isMobile: boolean;
}

export const showPopup = ({
    mapInstance,
    popupRef,
    feature,
    isMobile,
}: PopupProps) => {
    if (!mapInstance || !popupRef.current) return;
    
    popupRef.current
        .setLngLat((feature.geometry as any).coordinates)
        .setHTML(getPopUpStylePoints({ feature, isMobile }))
        .addTo(mapInstance);
};
