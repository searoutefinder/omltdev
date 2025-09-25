import { useEffect, useContext, RefObject } from "react";
import { FeatureCollection, LineString, Point } from "geojson";
import { MapContext } from "../../../context/CreateContext";

interface DataFetcherProps {
  jsonMasterTableRef: RefObject<any | null>;
  geojsonTrailsRef: RefObject<FeatureCollection<LineString> | null>;
  geojsonPOIsRef: RefObject<FeatureCollection<Point> | null>;
  geojsonKiosksRef: RefObject<FeatureCollection<Point> | null>;
  setIsLoading: (isLoading: boolean) => void;
  setDataLoaded: (dataLoaded: boolean) => void;
}

export function DataFetcher({jsonMasterTableRef, geojsonTrailsRef, geojsonPOIsRef, geojsonKiosksRef, setIsLoading, setDataLoaded}: DataFetcherProps) {

  const { mapState } = useContext(MapContext);

  const { masterTable, trails, pois, kiosks } = mapState?.dataRefs ?? {};

  useEffect(() => {
    //#Tamas 10. 
    // depends on the maptype
    // For your maptype: trails template is only required - trails will be minimun, I think.
    // you will probably have two more templates: masterTable and pois 
    if (
      !masterTable &&  !trails && !pois && !kiosks
    ) {
      return;
    }

    //console.log(masterTable, trails, pois, kiosks);

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

      // 4) POIs
      fetchJson<FeatureCollection<Point>>(pois).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          geojsonPOIsRef.current = fc;
        }
      }),

      // 5) Kiosks
      fetchJson<FeatureCollection<Point>>(kiosks).then((fc) => {
        if (!cancelled && fc?.features?.length) {
          geojsonKiosksRef.current = fc;
        }
      })      
    ];

    // when all requests settle (success), decide if set "loaded" or "not"
    Promise.allSettled(tasks).finally(() => {
      if (cancelled) return;

      setIsLoading?.(false);

      const requiredOk =
        Boolean(geojsonTrailsRef.current) &&
        Boolean(geojsonPOIsRef.current) &&
        Boolean(geojsonKiosksRef.current);

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
      pois]);

  return null;
}
