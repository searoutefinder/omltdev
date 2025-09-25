import { centroid } from '@turf/turf';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

interface DonationPinProps {
    geojson: FeatureCollection<Geometry, GeoJsonProperties>;
    // activePreserve: string | null;
}

//#fix move onto separate thread
export const getDonationData = ({ geojson }: DonationPinProps) => {

    if (!geojson || !geojson.features) return null;
    const updatedFeatures = [];
  
    for (const feature of geojson.features) {
        if (!feature.geometry || !feature.properties) continue;
        
        if (feature.geometry.type === "LineString"
            || feature.geometry.type === "MultiLineString"
            || feature.geometry.type === "Point"
        ) {
            let updatedFeature;

            if (feature.geometry.type === "Point") {
                const [longitude, latitude] = feature.geometry.coordinates;
                const offsetLongitude = longitude + 0.0000; //offset to the east
                const offsetLatitude = latitude + 0.00015; //offset to the north

                updatedFeature = {
                    ...feature,
                    geometry: {
                        ...feature.geometry,
                        coordinates: [offsetLongitude, offsetLatitude],
                    },
                };
            } else {
                const centroidCoords = centroid(feature);

                updatedFeature = {
                    ...feature,
                    geometry: centroidCoords.geometry,
                };
            }

            updatedFeatures.push(updatedFeature);
        }
    }

    return {
        type: "FeatureCollection",
        features: updatedFeatures,
    };
};
