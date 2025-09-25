export function zoomToPoint(
  mapInstance: mapboxgl.Map | null,
  geometry: [number, number],
  zoomLevel: number,
  isMobile: boolean,
  duration: number
) {
  if (!mapInstance) return;

  //left padding if desktop
  const padding = isMobile
    ? undefined
    : { left: 450, top: 0, right: 0, bottom: 0 }

  mapInstance.easeTo({
    center: geometry,
    zoom: zoomLevel,
    essential: true,
    speed: 0.2,
    duration: duration,
    curve: 1,
    padding: padding,
    easing: (t) => t
  });
}