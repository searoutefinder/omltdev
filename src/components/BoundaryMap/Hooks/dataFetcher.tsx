import { useEffect, useRef, MutableRefObject} from 'react';
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";

interface DataFetcherProps { 
    styleLoaded: boolean;
    geojsonPreserveRef: MutableRefObject<FeatureCollection<Polygon | MultiPolygon> | null>;
    setDataLoaded: (dataLoaded: boolean) => void;
}


export const DataFetcher = ({ 
  styleLoaded,
  geojsonPreserveRef,
  setDataLoaded}: DataFetcherProps) => {
  
  const dataFetchedRefPreserve = useRef(false);  
  const url : string = 'https://services9.arcgis.com/TkSpD6kCAXkp8Jk5/ArcGIS/rest/services/LGLC_CustomMaps_GIS/FeatureServer/2/query?where=1%3D1&objectIds=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&returnEnvelope=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&collation=&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnTrueCurves=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
  
  useEffect(() => {
        
    if(!styleLoaded) return;

       const fetchPreserveData = async () => {
        const response = await fetch(url);
        const data: FeatureCollection<Polygon | MultiPolygon> = await response.json();
        dataFetchedRefPreserve.current = true;  
        if (!data?.features || data.features.length === 0) return;
        geojsonPreserveRef.current = data;
        setDataLoaded(true);
      };


    if (!dataFetchedRefPreserve.current) {
      fetchPreserveData();
    };
    
    
  }, [styleLoaded, 
      geojsonPreserveRef, 
      setDataLoaded]);

  return null; 
};

