// Core
import React, { useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Components
import PopupBody from '../Popups/PopupBody';

// 3rd party libraries
import mapboxgl from 'mapbox-gl';

// Component def
const Popup = ({ map, activeFeature }) => {

  // Declare refs
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const contentRef = useRef(document.createElement("div"));

  // Declare hooks
  useEffect(() => {
    if (!map) return

    popupRef.current = new mapboxgl.Popup({
      "closeOnClick": false,
      "closeButton": false,
      "className": "custom-popup",
      "maxWidth": "340px",
      "offset": {
        "top": [0, 15],
        "bottom": [0, -15],
        'top-left': [0, 15],
        'top-right': [0, 15],
        'bottom-left': [0, -15],
        'bottom-right': [0, -15],
        "left": [10, 0],
        "right": [-10, 0]
      }
    })
    
    return () => {
      if(popupRef.current !== null) {
        popupRef.current.remove()
      }
    }

  }, [])

  useEffect(() => {
    if (!activeFeature || activeFeature === null || popupRef.current === null) return;

    popupRef.current
      .setLngLat(activeFeature.clickPos)
      .setDOMContent(contentRef.current)
      .addTo(map);

  }, [activeFeature])

  return (
    <>{
      createPortal(
        <PopupBody
          isMobile={false}
          title={activeFeature.data.poi_name || activeFeature.data.kiosk_name}
          description={activeFeature.data.poi_descri || activeFeature.data.kiosk_desc}
          images={
            [
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
              "https://images.unsplash.com/photo-1526045478516-99145907023c",
              "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
              "https://images.unsplash.com/photo-1526045478516-99145907023c",
              "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            ]
          }
        />,
        contentRef.current
      )
    }</>
  )

}

export default Popup;
