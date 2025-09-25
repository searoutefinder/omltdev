import { useEffect, MutableRefObject } from "react";
import { FeatureCollection, LineString, Point, Polygon, MultiPolygon } from "geojson";
import {addTrailLayer, addPOILayer, addKioskLayer } from "../../../components/Layers/WalkMap"
import { BasemapConfigTypes } from "@/components/Basemaps/types";

//define interface
interface AddLayersProps {
  mapInstance: mapboxgl.Map | null;
  mainSources: string[];
  dataLoaded: boolean;
  styleLoaded: boolean;
  dataRefs: {
    preserve: string | null | undefined;
    trails: string | null | undefined;
    trailheads: string | null | undefined;
    parkingLots: string | null | undefined;
    pois: string | null | undefined;
    kiosks: string | null | undefined;
    distances: null | string | undefined;
    images: string[] | null | string | undefined;
    trailSourceName: string | null | undefined;
    sourceNames: string[];
  };
  geojsonPreserveRef: MutableRefObject<FeatureCollection<MultiPolygon | Polygon> | null>;  
  geojsonTrailsRef: MutableRefObject<FeatureCollection<LineString> | null>;
  geojsonPOIsRef: MutableRefObject<FeatureCollection<Point> | null>;
  geojsonKiosksRef: MutableRefObject<FeatureCollection<Point> | null>;
  currentTheme: BasemapConfigTypes;
  isMobile: boolean;
  setLayersLoaded: (layersLoaded: boolean) => void;
};

export const AddLayers = ({ 
  mapInstance, 
  mainSources, 
  dataLoaded, 
  dataRefs, 
  geojsonPreserveRef,
  geojsonTrailsRef, 
  geojsonPOIsRef,
  geojsonKiosksRef, 
  styleLoaded, 
  currentTheme, 
  isMobile, 
  setLayersLoaded }: AddLayersProps) => {

  useEffect(() => {
    if (!dataLoaded || !styleLoaded || !mapInstance || !currentTheme || !geojsonTrailsRef.current) return;

    addTrailLayer(mapInstance, geojsonTrailsRef.current, isMobile, currentTheme);
    addPOILayer(mapInstance, geojsonPOIsRef.current, currentTheme);
    addKioskLayer(mapInstance, geojsonKiosksRef.current, currentTheme);

    const sources = mainSources;
    const loadedSources = new Set<string>();
    
    const handleSourceData = (e: mapboxgl.MapSourceDataEvent) => {
      const srcId = e.sourceId;

      if (srcId && sources.includes(srcId) && e.isSourceLoaded && !loadedSources.has(srcId)) {
        loadedSources.add(srcId);
      }

      if (loadedSources.size >= sources.length) {
        setLayersLoaded(true);
        mapInstance?.off('sourcedata', handleSourceData);
      }
    };

    mapInstance?.on('sourcedata', handleSourceData);

    return () => {
      setLayersLoaded(false);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme, 
      isMobile, 
      styleLoaded, 
      dataLoaded, 
      dataRefs, 
      geojsonTrailsRef, 
      geojsonPreserveRef,
      mainSources, 
      geojsonPOIsRef,
      geojsonKiosksRef,
      setLayersLoaded, 
    ]);

  return null;
}