// #fix add (e) events
import mapboxgl from 'mapbox-gl';
import { handleSidebarToggle } from '../../../utils/Gestures/Sidebar';
import { getPopUpStyleTrails } from '../../../utils/Popup/PopUpTrails';
import { getPopUpStyleParking } from '../../../utils/Popup/PopUpParking';
import { normalizeName, truncateText } from '../../../utils/Text/index';
import { DonationInfoProps } from "../../../types/preserve-map";
import { BboxesMap } from '../../../constants/dataMapping';



interface MapEvents {
    map: mapboxgl.Map,
    isMobile: boolean,
    source: string;
    layerId: string,
    layerId2: string,
    layerId3: string,
    layerId4: string,
    layerId5?: string,
    hoveredFeatureId: string | number | null,
    isCollapsedLeft: boolean,
    isCollapsedRight: boolean;
    setIsCollapsedLeft: (collapsed: boolean) => void;
    setSelectedTrailId: (selectedTrailId: number | null) => void;
    setOpenItemIndex: (openItemIndex: number | null) => void;
    setIsCollapsedRight: (collapsed: boolean) => void;
    setDonationInfo: (donationInfo: DonationInfoProps) => void;
}


export const setupMapEvents = ({
    map,
    source,
    layerId,
    layerId2,
    layerId3,
    layerId4,
    hoveredFeatureId,
    isMobile,
    isCollapsedLeft,
    isCollapsedRight,
    setIsCollapsedLeft,
    setSelectedTrailId,
    setOpenItemIndex,
    setIsCollapsedRight,
}: MapEvents) => {

    //1.init pop-up 
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        closeOnMove: false
    });


    //1. BOTH VIEWS --------------------------------------------------
    const onDonationPinClick = (e: mapboxgl.MapMouseEvent) => {
        e.originalEvent.stopPropagation()
        e.preventDefault();
        const features = map.queryRenderedFeatures(e.point, {
            layers: [layerId2],
        });

        if (features.length > 0 && isCollapsedRight) {
            setIsCollapsedRight(!isCollapsedRight);
        };
    };


     const onMapClicked = (e: mapboxgl.MapMouseEvent) => {
      if(!e.originalEvent.defaultPrevented) {
        
        // Close the left hand sidebar on map click        
        setIsCollapsedLeft(true);

        handleSidebarToggle(map, false, isMobile);

        setIsCollapsedRight(true);

        const features = map.queryRenderedFeatures({layers: [layerId]})  
        
        features.forEach((feature) => {
          if (feature.id !== undefined) {
            map.removeFeatureState({"source": source, "id": feature.id});
          }
        })        
      }
    };


    const onParkingPinHover = (e: mapboxgl.MapMouseEvent) => {
        e.originalEvent.stopPropagation();
        e.preventDefault();

        const features = map.queryRenderedFeatures(e.point, {
            layers: [layerId3],
            radius: 5
        });

        const existingPopups = document.querySelectorAll('.mapboxgl-popup');
        existingPopups.forEach(popupEl => popupEl.remove());

        if (features.length > 0) {
            const properties = features[0].properties;
            if (properties) {
                const parkingSurfaceRaw = properties.parking_surface;
                const parkingSurface =  truncateText({ text: parkingSurfaceRaw, maxLength: 12 }) 
                const parkingSpots = properties.parking_spots;
                const parkingArea = properties.parking_area;
                const notes = properties.notes;
                popup
                    .setLngLat(e.lngLat)
                    .setHTML(
                        getPopUpStyleParking({
                            isMobile,
                            parkingSurface,
                            parkingSpots,
                            parkingArea,
                            notes
                        })
                    )
                    .addTo(map);
            } else {
                popup.remove();
            }
        } else {
            popup.remove();
        }
    };

    const onPreserveSymbolClick = (e: mapboxgl.MapMouseEvent) => {
        e.originalEvent.stopPropagation()
        e.preventDefault();
        const features = map.queryRenderedFeatures(e.point, {
            layers: [layerId4]
        });
        if (features.length > 0) {
            const properties = features[0].properties;
            const preserveName = properties?.preserve_name;
            const preserveNameFormatted = normalizeName(preserveName);
            // fit bounds within current view
            const preserveBbox = BboxesMap[preserveNameFormatted];
            if (preserveBbox) {
                map.fitBounds(
                    preserveBbox,
                    {
                        padding: { top: 0, bottom: 0, left: 0, right: 0 },
                    }
                );
            };

        } else {
            popup.remove();
        }
    };



    //2.DESKTOP ----------------------------------------------   
    const onMouseEnter = () => {
        map.getCanvas().style.cursor = 'pointer';
    };

    const onMouseLeave = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    };


    const onMouseMove = (e: mapboxgl.MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [layerId]
        });

        if (features.length > 0) {
            const feature = features[0];
            const name = feature.properties?.trail_name;
            popup
                .setLngLat(e.lngLat)
                .setHTML(
                    getPopUpStyleTrails(name, isMobile)
                )
                .addTo(map);
        } else {
            popup.remove();
        }
    };



    //3.MOBILES-------------------------------------------------- 
    const handleSvgClick = () => {
        if (isCollapsedLeft) {
            handleSidebarToggle(map, isCollapsedLeft, isMobile);
            setIsCollapsedLeft(!isCollapsedLeft);
        };
    };

    const onLineClick = (e: mapboxgl.MapMouseEvent) => {

        e.originalEvent.stopPropagation()
        e.preventDefault();

        if (popup) popup.remove();
        const buffer = 10;
        const bbox = [
            [e.point.x - buffer / 2, e.point.y - buffer / 2],
            [e.point.x + buffer / 2, e.point.y + buffer / 2],
        ];

        const sensitiveArea: [mapboxgl.PointLike, mapboxgl.PointLike] | mapboxgl.PointLike = isMobile
            ? (bbox as [mapboxgl.PointLike, mapboxgl.PointLike])
            : e.point;

        const features = map.queryRenderedFeatures(sensitiveArea, {
            layers: [layerId],
            filter: [
                'any',
                ['==', '$type', 'LineString'],
            ],
            radius: 10
        });
        if (features.length > 0) {
            const feature = features[0];
            const featureId = feature.id as string | number;
            const name = feature.properties?.trail_name;

            if (hoveredFeatureId !== null && hoveredFeatureId !== featureId) {
                map.setFeatureState({ source, id: hoveredFeatureId }, { hover: false });
            }
            hoveredFeatureId = featureId;
            map.setFeatureState({ source, id: hoveredFeatureId }, { hover: true });

            const numericTrailId = typeof featureId === 'number' ? featureId : null;

            if (!isMobile) {
                setSelectedTrailId(numericTrailId);
                setOpenItemIndex(numericTrailId);

                if (isCollapsedLeft) {
                    handleSidebarToggle(map, isCollapsedLeft, isMobile);
                    setIsCollapsedLeft(!isCollapsedLeft);
                }
            } else {
                popup
                    .setLngLat(e.lngLat)
                    .setHTML(
                        getPopUpStyleTrails(name, isMobile)
                    )
                    .addTo(map);

                const attachSvgClickListener = () => {
                    const eventElement = isMobile ? '#Container' : 'img';
                    const imgElement = document.querySelector(eventElement);
                    if (imgElement) {
                        imgElement.removeEventListener('click', handleSvgClick);
                        imgElement.addEventListener('click', handleSvgClick);
                    }
                };

                setTimeout(attachSvgClickListener, 10);
                setSelectedTrailId(numericTrailId);
                setOpenItemIndex(numericTrailId);
            }
        }
    };

    //3.add event listeners ----------------------------------------------
    //== DESKTOP
    if (!isMobile) {
        map.on('mouseenter', layerId, onMouseEnter);
        map.on('mousemove', layerId, onMouseMove);
        map.on('mouseleave', layerId, onMouseLeave);
        map.on('click', onMapClicked);
        map.on('click', layerId, onLineClick);
        //---------------------
        map.on('mouseenter', layerId2, onMouseEnter);
        map.on('mouseleave', layerId2, onMouseLeave);
        map.on('click', layerId2, onDonationPinClick);
        //---------------------
        map.on('mouseenter', layerId3, onMouseEnter);
        map.on('mouseleave', layerId3, onMouseLeave);
        map.on('mouseenter', layerId3, onParkingPinHover);
        //---------------------
        map.on('mouseenter', layerId4, onMouseEnter);
        map.on('mouseleave', layerId4, onMouseLeave);
        map.on('click', layerId4, onPreserveSymbolClick);

    } else {
        //== MOBILE
        map.on('click', onLineClick);
        map.on('click', onMapClicked);
        map.on('click', layerId2, onDonationPinClick);
        map.on('click', layerId3, onParkingPinHover);
        map.on('click', layerId4, onPreserveSymbolClick);

    }

    // Cleanup function
    return () => {
        map.off('mouseenter', layerId, onMouseEnter);
        map.off('mousemove', layerId, onMouseMove);
        map.off('mouseleave', layerId, onMouseLeave);
        map.off('click', layerId, onLineClick);
        map.on('click', onMapClicked);
        map.off('click', onLineClick);
        //---------------------
        map.off('mouseenter', layerId2, onMouseEnter);
        map.off('mouseleave', layerId2, onMouseLeave);
        map.off('click', layerId2, onDonationPinClick);
        //---------------------
        map.off('mouseenter', layerId3, onMouseEnter);
        map.off('mouseleave', layerId3, onMouseLeave);
        map.off('click', layerId3, onParkingPinHover);
        map.off('mouseenter', layerId3, onParkingPinHover);
        //---------------------
        map.off('mouseenter', layerId4, onMouseEnter);
        map.off('mouseleave', layerId4, onMouseLeave);
        map.off('click', layerId4, onPreserveSymbolClick);

    };

}







