// import { LngLatBoundsLike } from "mapbox-gl";
import {Feature, Point} from 'geojson';
import stringSimilarity from 'string-similarity';

const AGOL_BASE = "https://services9.arcgis.com/TkSpD6kCAXkp8Jk5/arcgis/rest/services/RisingRoutesOrganizations/FeatureServer/0/query";

//#FIX-Reduce number of api calls as much as possible
export const fetchAllFeatures = async (): Promise<Feature<Point>[]> => { 
   
    // //1. bbox on map movements   
    // const [west, south, east, north] = [
    //     (bounds as mapboxgl.LngLatBounds).getWest(),
    //     (bounds as mapboxgl.LngLatBounds).getSouth(),
    //     (bounds as mapboxgl.LngLatBounds).getEast(),
    //     (bounds as mapboxgl.LngLatBounds).getNorth()
    // ];
    //2.construct the query URL
    // const url = `${AGOL_BASE}?f=geojson&geometry=${west},${south},${east},${north}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=*`;
    const url = `${AGOL_BASE}?f=geojson&where=1=1&outFields=*&returnGeometry=true&resultRecordCount=1000&orderByFields=organization_name`;

    //3. response
    const response = await fetch(url);
    const data = await response.json();
    //4. return the features
    return data && data.features ? data.features : [];
}

//#FIX-Reduce number of api calls as much as possible 
//#FIX - return 20 closest features to map center  
//and search results to 10 max

export const fetchSearchResults = async (
    query: string, 
    signal?: AbortSignal
): Promise<Feature<Point>[]> => {
    
    //1.construct the WHERE clause for the query
    const whereClause = `UPPER(organization_name) LIKE '%${query.toUpperCase()}%'`;

    //2.construct the full query URL
    const url = `${AGOL_BASE}?where=${encodeURIComponent(whereClause)}&outFields=*&returnGeometry=true&resultRecordCount=4&f=geojson`;

    //3.fetch data from the API
    const response = await fetch(url, { signal });
    const data = await response.json();

    //4. return an empty array if no data or features are found
    if (!data || !data.features) {
        return [];
    }

    //5.calculate similarity scores for each feature based on the query
    const featuresWithScores: { feature: Feature<Point>; score: number }[] = data.features.map((feature: Feature<Point>) => {
        const organizationName = feature.properties?.organization_name || '';
        const similarityScore = stringSimilarity.compareTwoStrings(
            organizationName.toLowerCase(),
            query.toLowerCase()
        );
        return { feature, score: similarityScore };
    });

    featuresWithScores.sort((a : any, b :any) => b.score - a.score);

    return featuresWithScores.map(({ feature }: { feature: Feature<Point> }) => feature);
};
  