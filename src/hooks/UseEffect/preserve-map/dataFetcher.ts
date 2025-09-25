import { useEffect, useContext, MutableRefObject } from "react";
import { FeatureCollection, LineString, MultiPolygon, Polygon, Point } from "geojson";
import { MapContext } from "../../../context/CreateContext";

interface DataFetcherProps {
  jsonMasterTableRef: MutableRefObject<any | null>;
  geojsonTrailsRef: MutableRefObject<FeatureCollection<LineString> | null>;
  geojsonPreserveRef: MutableRefObject<FeatureCollection<Polygon | MultiPolygon> | null>;
  geojsonPOIsRef: MutableRefObject<FeatureCollection<Point> | null>;
  geojsonTrailheadsRef: MutableRefObject<FeatureCollection<Point> | null>;
  geojsonParkingLotsRef: MutableRefObject<FeatureCollection<Point> | null>;
  setIsLoading: (isLoading: boolean) => void;
  setDataLoaded: (dataLoaded: boolean) => void;
}

export function DataFetcher({
  jsonMasterTableRef,
  geojsonTrailsRef,
  geojsonPreserveRef,
  geojsonPOIsRef,
  geojsonTrailheadsRef,
  geojsonParkingLotsRef,
  setIsLoading,
  setDataLoaded,
}: DataFetcherProps) {
  const { mapState } = useContext(MapContext);

  const {
    masterTable,
    trails,
    preserve,
    pois,
    trailheads,
    parkingLots,
  } = mapState?.dataRefs ?? {};

  useEffect(() => {
    if (
      !masterTable && !preserve
    ) {
      return;
    }

    const ac = new AbortController();
    let cancelled = false;

    // typed fetch with abort support
    const fetchJson = async <T,>(url?: string): Promise<T | null> => {
      if (!url) return null;
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return (await res.json()) as T;
    };

    setIsLoading?.(true);
    setDataLoaded(false);

    // kick off all requests in parallel
    const tasks: Promise<unknown>[] = [
      // 1) master table 
      fetchJson<any>(masterTable).then((data) => {
        if (!cancelled && data) jsonMasterTableRef.current = data;
      }),

      // 2) trails (FeatureCollection<LineString>) + move props.id -> feature.id
      fetchJson<FeatureCollection<LineString>>(trails).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          for (const ft of fc.features) {
            const propId = (ft.properties as any)?.id;
            if (propId !== undefined && propId !== null) {
              (ft as any).id = propId; // valid GeoJSON top-level id
            }
          }
          geojsonTrailsRef.current = fc;
        }
      }),

      // 3) preserve 
      fetchJson<FeatureCollection<Polygon | MultiPolygon>>(preserve).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          geojsonPreserveRef.current = fc;
        }
      }),

      // 4) POIs
      fetchJson<FeatureCollection<Point>>(pois).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          geojsonPOIsRef.current = fc;
        }
      }),

      // 5) trailheads
      fetchJson<FeatureCollection<Point>>(trailheads).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          geojsonTrailheadsRef.current = fc;
        }
      }),

      // 6) parking lots
      fetchJson<FeatureCollection<Point>>(parkingLots).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          geojsonParkingLotsRef.current = fc;
        }
      }),
    ];

    // when all requests settle (success), decide if set "loaded" or "not"
    Promise.allSettled(tasks).finally(() => {
      if (cancelled) return;

      setIsLoading?.(false);

      const requiredOk =
        Boolean(jsonMasterTableRef.current) &&
        Boolean(geojsonTrailsRef.current) &&
        Boolean(geojsonPreserveRef.current) &&
        Boolean(geojsonPOIsRef.current);

      setDataLoaded(requiredOk);
    });

    return () => {
      cancelled = true;
      ac.abort();
    };
  // ref object won't change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterTable, 
      trails, 
      preserve, 
      pois, 
      trailheads, 
      parkingLots]);

  return null;
}
