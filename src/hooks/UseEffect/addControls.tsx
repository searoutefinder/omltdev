import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

interface ControlsProps {
  mapInstance: mapboxgl.Map | null;
  geolocateControl: React.MutableRefObject<mapboxgl.GeolocateControl | null>;
  styleLoaded: boolean;
  isMobile: boolean;
}

export const AddControls = ({ mapInstance, geolocateControl, isMobile, styleLoaded }: ControlsProps) => {
  const [locationMarker, setLocationMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!styleLoaded || !mapInstance) return; 
    // enable geolocation control
    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });

    mapInstance.addControl(geolocateControl.current, "top-right");

    //For WIX users- If geolocation is not supported 
    setTimeout(() => {
      const geoButton = document.querySelector(".mapboxgl-ctrl-geolocate");
      if (geoButton) {
        geoButton.removeAttribute("disabled");
        geoButton.addEventListener("click", handleMoveMap); 
      } else {
        console.warn("geolocation button not found.");
      }
    }, 2000); 

    // MOBILES - disable zoom on double click and scroll
    if (isMobile) {
      mapInstance.doubleClickZoom.disable();
      mapInstance.scrollZoom.disable();
    }

    return () => {
      const geoButton = document.querySelector(".mapboxgl-ctrl-geolocate");
      if (geoButton) {
        geoButton.removeEventListener("click", handleMoveMap);
      }
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleLoaded, isMobile, geolocateControl, mapInstance]);


  // blue circle marker
  const addGeolocationMarker = (lat: number, lon: number) => {
    if (!mapInstance) return;

    // remove old marker if exists
    if (locationMarker) {
      locationMarker.remove();
    }

  
   //container 
  const markerContainer = document.createElement("div");
  markerContainer.style.width = "24px";
  markerContainer.style.height = "24px";
  markerContainer.style.opacity = "1";
  markerContainer.style.transform = "translate(261px, 602px) translate(-50%, -50%) translate(0px, 0px)";


  //animated circle 
  const animatedCircle = document.createElement("div");
  animatedCircle.style.width = "20px";
  animatedCircle.style.height = "20px";
  animatedCircle.style.alignItems = "center";
  animatedCircle.style.justifyContent = "center";
  animatedCircle.style.background = "rgba(0, 122, 255, 0.3)";
  animatedCircle.style.borderRadius = "50%";
  animatedCircle.style.border = "2px solid #007AFF";
  animatedCircle.style.animation = "pulse 1.5s infinite ease-in-out"; 
 
  markerContainer.appendChild(animatedCircle);

  //blue circle 
  const circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.top = "50%";
  circle.style.left = "50%";
  circle.style.width = "15px";
  circle.style.height = "15px";
  circle.style.background = "#2688f19d";
  circle.style.borderRadius = "50%";
  circle.style.transform = "translate(-50%, -50%)";
  
  markerContainer.appendChild(circle);


  if (!document.getElementById("pulseAnimation")) {
    const style = document.createElement("style");
    style.id = "pulseAnimation";
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.5); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  };

    const marker = new mapboxgl.Marker(markerContainer)
    .setLngLat([lon, lat]) 
    .addTo(mapInstance);
  
    setLocationMarker(marker);
  };


  const handleMoveMap = (event?: Event) => {
    event?.preventDefault(); 
    if (!mapInstance) return;
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get("lat");
    const lon = urlParams.get("lon");

    if (lat && lon) {
      mapInstance.flyTo({
        center: [parseFloat(lon), parseFloat(lat)],
        zoom: 14,
        essential: true,
      });

      addGeolocationMarker(parseFloat(lat), parseFloat(lon));
    } else {
      console.log("no coordinates from wix base URL, triggering mapbox native geolocation");
      
      if (geolocateControl.current) {
        geolocateControl.current.trigger();
      } else {
        console.warn("geolocation control not found.");
      }
    }
  };

  return null;
};


