import { useEffect, useRef } from "react";
import { LineString, FeatureCollection } from "geojson";
import { getSidebarData } from "../../../utils/getSidebarData";
import { Bbox } from "@/types/preserve-map";
import { BboxesMap } from '../../../constants/dataMapping';

interface SetSidebarDataProps {
    styleLoaded: boolean;
    activePreserve: string | null;
    dataLoaded: boolean;
    isLoading: boolean;
    geojson: FeatureCollection<LineString> | null;
    bbox: Bbox;
    setSidebarData: (geojson: any) => void;
    setIsLoading: (loading: boolean) => void;
}

export const SetSidebarData = ({ styleLoaded, isLoading, dataLoaded, activePreserve, geojson, bbox, setSidebarData, setIsLoading }: SetSidebarDataProps) => {
    const prevActivePreserveRef = useRef<string | null>(null);

    useEffect(() => {
        if (!dataLoaded || !geojson || !styleLoaded) {
            return;
        }

        //#fix- extrude is loading into separate hook
        if (activePreserve === prevActivePreserveRef.current) {
            setIsLoading(false);
        };

        if (activePreserve && activePreserve !== prevActivePreserveRef.current) {
            // console.log('setSiteBarComp2:', activePreserve);
            const preserveBbox = BboxesMap[activePreserve];
            if (preserveBbox) {
                const sidebarData = getSidebarData(geojson);
                setSidebarData(sidebarData);
                setTimeout(() => {
                    setIsLoading(false);
                }, 150);
                prevActivePreserveRef.current = activePreserve;
            }
        }

    }, [dataLoaded,
        isLoading,
        geojson,
        activePreserve,
        styleLoaded,
        bbox,
        setIsLoading,
        setSidebarData]);
};
