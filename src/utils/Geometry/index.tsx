import { Bbox } from "@/types/preserve-map";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";


//Types
type LineCoordinates = [number, number][];
type MultiLineCoordinates = [number, number][][];
type Coordinates = LineCoordinates | MultiLineCoordinates;
type PointCoordinates = [number, number];


export const lngLatEquals = (a: mapboxgl.LngLat, b: mapboxgl.LngLat) =>
    a.lng === b.lng && a.lat === b.lat;


export const boundsEquals = (
    a: mapboxgl.LngLatBounds,
    b: mapboxgl.LngLatBounds
) =>
    lngLatEquals(a.getSouthWest(), b.getSouthWest()) &&
    lngLatEquals(a.getNorthEast(), b.getNorthEast());


export const convertBoundsToBbox = (bounds: mapboxgl.LngLatBounds): Bbox => {
    return [[bounds.getWest(), bounds.getSouth()],
    [bounds.getEast(), bounds.getNorth()]];
};


export const isLineWithinBbox = (bbox: Bbox, coordinates: Coordinates): boolean => {
    const [minX, minY] = bbox[0];
    const [maxX, maxY] = bbox[1];

    if (Array.isArray(coordinates[0][0])) {
        return (coordinates as MultiLineCoordinates).some(line =>
            line.some(([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY)
        );
    } else {
        return (coordinates as LineCoordinates).some(([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY);
    }
};


export const isPointWithinBbox = (bbox: Bbox, point: PointCoordinates): boolean => {
    const [minX, minY] = bbox[0];
    const [maxX, maxY] = bbox[1];

    const [x, y] = point;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
};


export const arePointsWithinBbox = (bbox: Bbox, points: PointCoordinates[]): boolean => {
    return points.some(point => isPointWithinBbox(bbox, point));
};


export const pointInBounds = (coord: [number, number], bounds: { sw: [number, number], ne: [number, number] }): boolean => {
    return (
        coord[0] >= bounds.sw[0] &&
        coord[0] <= bounds.ne[0] &&
        coord[1] >= bounds.sw[1] &&
        coord[1] <= bounds.ne[1]
    );
};


export function polygonsToMultiPolygon(
    fc: FeatureCollection<Polygon | MultiPolygon>
): Feature<MultiPolygon> {
    const multiCoords: any[] = [];

    for (const feat of fc.features) {
        if (!feat.geometry) {
            continue;
        }

        if (feat.geometry.type === "Polygon") {
            multiCoords.push(feat.geometry.coordinates);
        } else if (feat.geometry.type === "MultiPolygon") {
            multiCoords.push(...feat.geometry.coordinates);
        } else {
            console.warn("Wrong geometry type");
        }
    }

    return {
        type: "Feature",
        properties: {},
        geometry: {
            type: "MultiPolygon",
            coordinates: multiCoords,
        },
    };
}

