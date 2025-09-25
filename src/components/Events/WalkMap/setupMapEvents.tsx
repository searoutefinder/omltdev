// #fix add (e) events
import mapboxgl from 'mapbox-gl';
import type { Feature, Geometry, Point } from 'geojson';
import { handleSidebarToggle } from '../../../utils/Gestures/Sidebar';
import { getPopUpStyleTrails } from '../../../utils/Popup/PopUpTrails';
import { getPopUpStyleParking } from '../../../utils/Popup/PopUpParking';
import { normalizeName, truncateText } from '../../../utils/Text/index';
import { BboxesMap } from '../../../constants/dataMapping';


interface MapEvents {
    map: mapboxgl.Map,
    isMobile: boolean,
    source: string;
    layerId: string,
    layerId2: string,
    layerId3: string,
    layerId4: string,
    layerId5: string,
    layerId6: string,
    hoveredFeatureId: string | number | null,
    isCollapsedLeft: boolean,
    isCollapsedRight: boolean;
    setIsCollapsedLeft: (collapsed: boolean) => void;
    setSelectedTrailId: (selectedTrailId: number | null) => void;
    setOpenItemIndex: (openItemIndex: number | null) => void;
    setIsCollapsedRight: (collapsed: boolean) => void;
    clickedFeature: any;
    setClickedFeature: (clickedFeature: any) => void;
}


//#Tamas 0. - you mentioned that you fixed these typescrit warnings and cleanups. let me know if you need any help or extra explanations 
//#Boris 0. - I've fixed the typescript warnings in ALL of the event handler methods, where the feature is read from the MapMouseEvent
// That is, method like onPoiPinClick, onKioskPinClick, onParkingPinClick, onParkingPinHover methods got updated with the necessary
// Typescript changes

// p.s I am not quite satisfied with how the layers are passed to the setupMapEvents (layerId, layerId2, 3 and so on..)
// What do you think? I've not tocuhed them for now but there has got to be a nicer, more descriptive way of passing those layers

export const setupMapEvents = ({
  map,
  source,
  layerId,
  layerId2,
  layerId3,
  layerId4,
  layerId5,
  layerId6,
  hoveredFeatureId,
  isMobile,
  isCollapsedLeft,
  isCollapsedRight,
  setIsCollapsedLeft,
  setSelectedTrailId,
  setOpenItemIndex,
  setIsCollapsedRight,
  clickedFeature,
  setClickedFeature
}: MapEvents) => {

    //1.init pop-up 
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        closeOnMove: false
    });

    //1. BOTH VIEWS --------------------------------------------------
    const onDonationPinClick = (e: mapboxgl.MapMouseEvent) => {
        e.originalEvent.preventDefault();
        
        const features = map.queryRenderedFeatures(e.point, {
          layers: [layerId2],
        });

        if (features.length > 0 && isCollapsedRight) {            
          setIsCollapsedRight(!isCollapsedRight);
        };
    };
    const onPoiPinClick = (e: mapboxgl.MapMouseEvent) => {
      e.originalEvent.preventDefault();
      if (!e.features?.length) return;
      if (e.features[0].properties === null) return;
      
      const f = e.features?.[0] as Feature<Geometry> | undefined;
      if (!f || !f.geometry) return;   

      const [lng, lat] = (f.geometry as Point).coordinates;

      // Pass POI data to the Popup before display (omponents/Popups/Popup.tsx)
      setClickedFeature({
        clickPos: [lng, lat], 
        data: f.properties
      });
    };
    const onKioskPinClick = (e: mapboxgl.MapMouseEvent) => {
      e.originalEvent.preventDefault();
      
      if (!e.features?.length) return;
      if (e.features[0].properties === null) return;

      const f = e.features?.[0] as Feature<Point> | undefined;
      if (!f || !f.geometry) return;   

      const [lng, lat] = (f.geometry as Point).coordinates;
      
      // Pass kiosk data to the Popup before display
      setClickedFeature({
        clickPos: [lng, lat], 
        data: f.properties
      });      
    };
    const onParkingPinClick = (e: mapboxgl.MapMouseEvent) => {      
      if(!e.originalEvent.defaultPrevented) {      
        e.originalEvent.preventDefault();
        if (!e.features?.length) return;
      }
    };
    // This onParkingPinHover still utilizes the OLD popup functionality which might need to be updated later
    // It still uses assets from the utils/Popup folder unlike the Poi and kiosk layers which already use the new Popup functionality
    const onParkingPinHover = (e: mapboxgl.MapMouseEvent) => {
      e.originalEvent.stopPropagation();
      e.preventDefault();      

      if (!e.features?.length) return;

      const f = e.features?.[0] as Feature<Geometry> | undefined;
      if (!f || !f.geometry) return;   

      const [lng, lat] = (f.geometry as Point).coordinates;


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
            .setLngLat([lng, lat])
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

        if (!e.features?.length) return;

        const features = map.queryRenderedFeatures(e.point, {
            layers: [layerId4]
        });

        if (features.length > 0) {
          const properties = features[0]?.properties;
          const preserveName = properties?.preserve_name;
          const preserveNameFormatted = normalizeName(preserveName);
          // fit bounds within current view
          const preserveBbox = BboxesMap[preserveNameFormatted];
          if (preserveBbox) {
            map.fitBounds(
              preserveBbox,
              {padding: { top: 0, bottom: 0, left: 0, right: 0 }}
            );
          };
        } 
        else 
        {
            popup.remove();
        }
    };
    const onMapClicked = (e: mapboxgl.MapMouseEvent) => {
      if(!e.originalEvent.defaultPrevented) {
        
        // Close the left hand sidebar on map click        
        setIsCollapsedLeft(true);

        handleSidebarToggle(map, false, isMobile);

        setIsCollapsedRight(true);
        
        const features = map.queryRenderedFeatures({layers: [layerId]});
        
        features.forEach((feature) => {
          if (feature.id !== undefined) {
            map.removeFeatureState({
              "source": source,
              "id": feature.id
            });
          }
        });

        setClickedFeature(null); 

      }
    };


    //2.DESKTOP ----------------------------------------------   
    const onPointerEnter = () => {      
      map.getCanvas().style.cursor = 'pointer';
    };     
    const onPointerMove = () => {
      map.getCanvas().style.cursor = 'pointer';
    }; 
    const onPointerLeave = () => {
      map.getCanvas().style.cursor = '';
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

      if(!e.originalEvent.defaultPrevented) {
        e.originalEvent.preventDefault()
        
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

      }
      else
      {
        console.log("e.originalEvent.defultPrevented")
      }
    };

    //3.add event listeners ----------------------------------------------
    if (!isMobile) {
        map.on('click', layerId6, onKioskPinClick);
        map.on('mouseenter', layerId6, onPointerEnter);
        map.on('mouseleave', layerId6, onPointerLeave);        
        //---------------------
        map.on('mouseenter', layerId2, onPointerEnter);
        map.on('mouseleave', layerId2, onPointerLeave);
        map.on('click', layerId2, onDonationPinClick);
        //---------------------
        map.on('mouseenter', layerId3, onPointerEnter);
        map.on('mouseleave', layerId3, onPointerLeave);
        map.on('mouseenter', layerId3, onParkingPinHover);
        map.on('click', layerId3, onParkingPinClick)
        //---------------------
        map.on('mouseenter', layerId4, onPointerEnter);
        map.on('mouseleave', layerId4, onPointerLeave);
        map.on('click', layerId4, onPreserveSymbolClick);
        //---------------------
        map.on('mouseenter', layerId5, onPointerEnter);
        map.on('mousemove', layerId5, onPointerMove);        
        map.on('click', layerId5, onPoiPinClick);
        //---------------------
        
        map.on('mousemove', layerId, onPointerMove);
        map.on('mouseleave', layerId, onPointerLeave);

        map.on('click', layerId, onLineClick);
        map.on('click', onMapClicked);        

    } else {
        map.on('click', onLineClick);
        map.on('click', layerId2, onDonationPinClick);
        map.on('click', layerId3, onParkingPinHover);
        map.on('click', layerId4, onPreserveSymbolClick);
        map.on('click', layerId5, onPoiPinClick);
        map.on('click', layerId6, onKioskPinClick);

    }

    // Cleanup function
    return () => {
      map.off('mousemove', layerId, onMouseMove);
      map.off('mouseleave', layerId, onPointerLeave);
      map.off('click', layerId, onLineClick);
      map.off('click', onLineClick);
      //---------------------
      map.off('mouseenter', layerId2, onPointerEnter);
      map.off('mouseleave', layerId2, onPointerLeave);
      map.off('click', layerId2, onDonationPinClick);
      //---------------------
      map.off('mouseenter', layerId3, onPointerEnter);
      map.off('mouseleave', layerId3, onPointerLeave);
      map.off('click', layerId3, onParkingPinHover);
      map.off('mouseenter', layerId3, onParkingPinHover);
      //---------------------
      map.off('mouseenter', layerId4, onPointerEnter);
      map.off('mouseleave', layerId4, onPointerLeave);
      map.off('click', layerId4, onPreserveSymbolClick);
      //---------------------
      map.off('mouseenter', layerId5, onPointerEnter);
      map.off('mouseleave', layerId5, onPointerLeave);
      map.off('click', layerId5, onPoiPinClick);  
      //---------------------
      map.off('mouseenter', layerId6, onPointerEnter);
      map.off('mouseleave', layerId6, onPointerLeave);
      map.off('click', layerId6, onKioskPinClick);            
    };

}


