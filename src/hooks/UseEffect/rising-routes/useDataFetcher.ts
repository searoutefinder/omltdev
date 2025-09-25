import { useEffect } from "react";
import { FeatureCollection, Point, Feature } from "geojson";
import { fetchAllFeatures } from "../../../constants/AGOL/rising-routes/api";

interface Props {
  styleLoaded: boolean;
  idLookupRef: React.MutableRefObject<Record<number, Feature<Point>>>; 
  setIsFetching: (b: boolean) => void;
  onData: (fc: FeatureCollection<Point>) => void;
}

export const useDataFetcher = ({
  styleLoaded,
  idLookupRef,
  setIsFetching,
  onData,
}: Props) => {
  
  useEffect(() => {
    if (!styleLoaded) return;
    let aborted = false;

    (async () => {
      setIsFetching(true);
      try {
        const features = await fetchAllFeatures();
        if (aborted) return;

        const fc: FeatureCollection<Point> = { type: "FeatureCollection", features };
        idLookupRef.current = Object.fromEntries(
          features.map((f, i) => [typeof f.id === "number" ? f.id : i, f])
        );

        onData(fc);
      } finally {
        setIsFetching(false);
      }
    })();

    return () => { aborted = true };
  }, [styleLoaded, 
      idLookupRef,
      setIsFetching, 
      onData]);
};
