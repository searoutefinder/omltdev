import React, { useEffect, useState, ReactNode } from "react";
import { useSearchParams, useParams } from "react-router-dom";
// import { bbox } from "@turf/bbox";
//types
import { Bbox } from "@/types/preserve-map";
import { LngLatBoundsLike } from "mapbox-gl";
//context
import { MapState,  MapContext, PreserveNameContext} from "../CreateContext";
//helpers
import { fetchInitialStates } from "../initialPreserveStates"; 
import { getPreserveWithBBoxQuery } from "../../constants/AGOL/preserve-maps/api";


function PreserveNameProvider({ children }: { children: ReactNode }) {
  const [preserveName, setPreserveName] = useState<string | null>(null);
  return (
    <PreserveNameContext.Provider value={{ preserveName, setPreserveName }}>
      {children}
    </PreserveNameContext.Provider>
  );
};



function MapContextProvider({ children }: { children: ReactNode }) {
  const { preserveName } = useParams<{ preserveName?: string }>(); // PATH param
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get("serviceName");
  const orgId = searchParams.get("orgId");

  //states ===========================
  //global map context state
  const [mapState, setMapState] = useState<MapState | null>(null);
  const [bboxesMap, setBboxesMap] = useState<{ [key: string]: LngLatBoundsLike } | null>(null);

//1. Fetch all states and set initial state for map definedi in url
  useEffect(() => {
    if (!orgId || !serviceName) return
    const loadInitialState = async () => {
      try {
        const mapStates = await fetchInitialStates(orgId, serviceName);

       //set bboxes map for all preserves
        const bboxes: Record<string, Bbox> = Object.fromEntries(
          Object.entries(mapStates).map(([slug, value]) => {
            if (value && typeof value === "object") {
              (value as any).slug = slug;
            }
            return [slug, value.bbox as Bbox];
          })
        );

        //set initial map state 
        const state = preserveName && mapStates[preserveName]
           ? mapStates[preserveName]
           : mapStates["SchumannPreserve3D"];

        setMapState(state);
        setBboxesMap(bboxes);

        console.log("Initial map state loaded:", state);
      } catch (err) {
        console.log("Error loading initial state", err);
      }

    };
    loadInitialState();

  }, [orgId, serviceName, preserveName]);



  // // 2) BBOX FOR CAMERA 
  useEffect(() => {
    if ( 
      !mapState 
      || !preserveName 
      || !bboxesMap
      || !orgId 
      || !serviceName
    ) return;
    console.log('triggering')
    //Fallback to CACULATE BBOX FROM TRAILS if not present map state 
    
    // const fetchDataForBbox = async () => {
    //   let response;
    //   let hasTrails: boolean;
    //   /*
    //    #Tamas 2. Ignore here hardcoded parts. I will take care of it soon. 
    //     More in this comments [https://app.asana.com/1/1188061438574875/task/1210756535087320/comment/1210804403284883?focus=true]
    //   */
    //   if (mapState.bbox === false) {
    //     //calculate bbox for camera animation hook - using layerId
    //     const geojson = getPreserveWithBBoxQuery({
    //       orgId,
    //       serviceName,
    //       layerId: preserveName === "walkmaps" ? 1 : 2,
    //       preserveBbox: bboxesMap[preserveName]
    //     });

    //     const trailData = await fetch(`${geojson}`);
    //     if (!trailData.ok || mapState.hasTrails === false) {
    //       hasTrails = false;
    //       //if no trails data, calculate bbox from preserve data
    //       const geojson = getPreserveWithBBoxQuery({
    //         orgId,
    //         serviceName,
    //         layerId: 3,
    //         preserveBbox: bboxesMap[preserveName]
    //       });

    //       const preserveData = await fetch(`${geojson}`);
    //       response = await preserveData.json();
    //     } else {
    //       response = await trailData.json();
    //       hasTrails = response.features.length > 0;
    //     }

    //     const rawBbox = bbox(response)
    //     const Bbox = [
    //       [rawBbox[0], rawBbox[1]],
    //       [rawBbox[2], rawBbox[3]],
    //     ];

    //     if (!Bbox) return;

    //     setMapState(prev => ({
    //       ...prev,
    //       bbox: Bbox,
    //       hasTrails: hasTrails,
    //     }));
    //   }
    // };
    
    const fetchPreserveData = async () => {
      if (mapState.webMapName === null) {
        const geojson = getPreserveWithBBoxQuery({
          orgId,
          serviceName,
          layerId: 3,
          preserveBbox: bboxesMap[preserveName]
        });

        const data = fetch(`${geojson}`);
        const response = await (await data).json();
        const feature = response.features[0];
        const { preserve_name,
          preserve_type,
          owner,
          description,
          contact_email: email } = feature.properties;

        //mandatory fields in preserve template
        if (!preserveName || !owner || !preserve_type) return;
          
        setMapState(prev => ({
          ...prev,
          webMapName: preserve_name,
          preserveType: preserve_type,
          owner: owner,
          desc: description,
          email: email,
        }));
      };
    };

    // fetchDataForBbox();
    fetchPreserveData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ preserveName,
       mapState,
       orgId,
       serviceName]);

  if (!mapState || !bboxesMap) return null;

  return (
    <MapContext.Provider value={{ mapState, bboxesMap, setMapState }}>
      {children}
    </MapContext.Provider>
  );
}


 
export {
  PreserveNameProvider,
  MapContextProvider,
};


