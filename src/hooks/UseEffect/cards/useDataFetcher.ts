import { useEffect, useRef, startTransition } from "react";
import { getMasterTableData } from "../../../constants/AGOL/cards/api";
import { getPreserveName } from "../../../utils/Text";


interface useDataFetcherProps {
    orgId: string | null; //org id
    serviceName: string | null; //client id/item id
    setData: (data: any) => void;
    setIsFetching: (b: boolean) => void;
}


export const useDataFetcher = ({
    orgId,
    serviceName,
    setIsFetching,
    setData
}: useDataFetcherProps) => {
    const hasFetched = useRef(false);
    useEffect(() => {
        if (hasFetched.current || !serviceName || !orgId) return;
        const fetchData = async () => {
            try {
                setIsFetching(true);
                const features = await getMasterTableData(orgId, serviceName);
                if (!features) {
                    console.error("No features found in the fetched data");
                    setIsFetching(false);
                    setData([]);
                    return;
                }

              
                const sortedFeatures = Array.isArray(features)
                    ? [...features].sort((a: any, b: any) =>
                        getPreserveName(a).localeCompare(getPreserveName(b), undefined, { sensitivity: "base" })
                    )
                    : features;

                setData(sortedFeatures);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsFetching(false);
            }
        }
        startTransition(() => {
            fetchData();
        });
        hasFetched.current = true;
    }, [orgId,
        serviceName,
        setData,
        setIsFetching
    ]);

    return null
}

