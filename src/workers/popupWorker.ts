/// <reference lib="webworker" />
import * as turf from "@turf/turf";
import { pointInBounds } from "../utils/Geometry";


self.onmessage = (e) => {
    const { type, geojson, bounds } = e.data;

    if (type === "processLines") {
        if (!geojson || !bounds) return;

        const linesWithVisibility = geojson.features
            .map((feature: GeoJSON.Feature) => {
                if (feature.geometry.type === "LineString" || feature.geometry.type === "MultiLineString") {
                    const lineCoords = (
                        feature.geometry.type === "MultiLineString"
                            ? (feature.geometry.coordinates as [number, number][][]).flat()
                            : feature.geometry.coordinates
                    ) as [number, number][];

                    const visibleCoords = lineCoords.filter((coord) =>
                        pointInBounds(coord, bounds)
                    );

                    // if none of it is visible -> ratio = 0
                    const ratio = lineCoords.length > 0 ? visibleCoords.length / lineCoords.length : 0;
                    return { feature, visibleRatio: ratio };
                }
                return null;
            })
            .filter(Boolean)
            // sort lines parts by visibleRatio DESC
            .sort((a: { visibleRatio: number; }, b: { visibleRatio: number; }) => b.visibleRatio - a.visibleRatio)
            // max 2 pop-ups at same moment
            .slice(0, 2);

        //#fix - get line segments depending on type
        const popupData = linesWithVisibility.map(({ feature }: { feature: GeoJSON.Feature }) => {
            let lineSegments: [number, number][][] = [];

            if (feature.geometry.type === "LineString") {
                lineSegments = [feature.geometry.coordinates as [number, number][]];
            } else if (feature.geometry.type === "MultiLineString") {
                lineSegments = feature.geometry.coordinates as [number, number][][];
            }

            const popupCoordinates = lineSegments.flatMap((lineCoords) => {
                const lineString = turf.lineString(lineCoords);
                const totalLength = turf.length(lineString);

                // break points for popups
                const breakpoints = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

                return breakpoints.map((pct) => {
                    const point = turf.along(lineString, totalLength * pct);
                    return point.geometry.coordinates as [number, number];
                });
            });

            return {
                featureId: feature.id,
                popupCoordinates,
                name: feature.properties?.trail_name
            };
        });

        self.postMessage({ type: "processedData", popupData });
    }
};
