import { useEffect, useRef, startTransition } from "react";
import {FiltersOptionsType, FiltersType} from "../../../types/rising-routes";


interface UseFilterWorkerProps {
    features: GeoJSON.FeatureCollection | null;
    filters: FiltersType;
    setFilteredIds: (ids: number[]) => void;
    setFilterOptions: (options: FiltersOptionsType) => void;
    setFilters: (filters: FiltersType) => void;
    setIsFiltering: (fetching: boolean) => void;
}

export const useFilterWorker = ({
    features,
    filters,
    setFilteredIds,
    setFilterOptions,
    setIsFiltering
}: UseFilterWorkerProps) => {

    const workerRef = useRef<Worker | null>(null);

    // 1. init worker only once
    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(
                new URL("../../../workers/filterWorker.ts", import.meta.url),
                { type: "module" }
            );

            // listen for messages from the worker
            workerRef.current.onmessage = (e: MessageEvent) => {
                if (e.data.type === "filteredIds") {
                    const { filterOptions, ids} = e.data;
                    startTransition(() => {
                        setFilteredIds(ids); 
                        setFilterOptions(filterOptions);
                        setTimeout(() => {
                            setIsFiltering(false);
                        }, 250)
                    });

                };
            };
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFilteredIds]);



    //2.send features from main thread to worker thread - only once
    useEffect(() => {
        if (workerRef.current && features) {
            workerRef.current.postMessage({
                type: 'setFeatures',
                features: features
            });
        }
    }, [features]);




    // 3.send selected selected state, city and orgType to worker thread
    useEffect(() => {
        if (workerRef.current && features) {
            setIsFiltering(true); //
            workerRef.current.postMessage({
                type: 'filtering',
                filters: filters
            });

        };

    }, [
        features,
        filters,
        setIsFiltering]);


}