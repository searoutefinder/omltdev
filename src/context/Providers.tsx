import React, { useEffect, useState, ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { bbox } from "@turf/bbox";
import { MapState, SavedContext, MapContext, PopupContext, PreserveNameContext, TemplatesStatus, TemplatesStatusContext } from "./CreateContext";
import { useDeviceInfo } from "../hooks/UseEffect/mobiles/useIsMobile";
import { InitialMapStates } from "./initialPreserveStates";
import { InitialTemplateStates } from "./initialTemplateStates";
import { BboxesMap } from "../constants/dataMapping";
import { getPreserveWithBBoxQuery } from "../constants/AGOL/preserve-maps/api";
import { pickBestBySlug } from "../utils/Text";


function AppContextProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const deviceInfo = useDeviceInfo();
  return (
    <SavedContext.Provider
      value={{
        isMobile: deviceInfo?.isMobile ?? isMobile,
        isIOS: deviceInfo?.isIOS ?? isIOS,
        setIsMobile,
        setIsIOS,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

function PopupContextProvider({ children }: { children: ReactNode }) {
  const [clickedFeature, setClickedFeature] = useState(null);

  return (
    <PopupContext.Provider value={{clickedFeature, setClickedFeature}}>
      {children}
    </PopupContext.Provider>
  );
}

function PreserveNameProvider({ children }: { children: ReactNode }) {
  const [preserveName, setPreserveName] = useState<string | null>(null);
  return (
    <PreserveNameContext.Provider value={{ preserveName, setPreserveName }}>
      {children}
    </PreserveNameContext.Provider>
  );
};

function MapContextProvider({ children }: { children: ReactNode }) {

  const { preserveName } = useParams<{ preserveName: keyof typeof InitialMapStates }>();
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get("serviceName");
  const orgId = searchParams.get("orgId");

  //states ===========================
  //#FIX - fetch bboxes from database - add bbox field into the master table
  const initialMapState = preserveName && InitialMapStates(orgId, serviceName)[preserveName]
    ? InitialMapStates(orgId, serviceName)[preserveName]
    : InitialMapStates(orgId, serviceName).SchumannPreserve3D;

  //global map context state
  const [mapState, setMapState] = useState<MapState>(initialMapState);


  useEffect(() => {
    if (!mapState || !preserveName || !orgId || !serviceName) return;
    const fetchDataForBbox = async () => {
      /*
       #Tamas 2. Ignore here hardcoded parts. I will take care of it soon. 
        More in this comments [https://app.asana.com/1/1188061438574875/task/1210756535087320/comment/1210804403284883?focus=true]
      */
      //1. 
      if (mapState.bbox === false) {
        //calculate bbox from preserve data for camera animation hook
        const geojson = getPreserveWithBBoxQuery({
          orgId,
          serviceName,
          layerId: 3,
          preserveName: preserveName,
          preserveBbox: BboxesMap[preserveName]
        });

        let response;
        let hasTrails = mapState.hasTrails ?? true;

        const preserveData = await fetch(`${geojson}`);
        if (!preserveData.ok) {
          //if no preserve data, calculate bbox from trails - using layerId
          const geojson = getPreserveWithBBoxQuery({
            orgId,
            serviceName,
            layerId: preserveName === "walkmaps" ? 1 : 2,
            preserveName: preserveName,
            preserveBbox: BboxesMap[preserveName]
          });

          const trailData = await fetch(`${geojson}`);

          if (!trailData.ok || mapState.hasTrails === false) {
            hasTrails = false;
            return; // if no preserve data and no trails — no point in calculating bbox
          } else {
            response = await trailData.json();
            hasTrails = response.features.length > 0;
          }
        } else {
          const preserveJson = await preserveData.json();
            // if no preserve data, fallback to trails
            if (!preserveJson?.features?.length) {
                const best = pickBestBySlug(preserveJson.features, preserveName);
                if (best) {
                const matchedFeature = preserveJson.features.find(
                  (f: any) => f.properties.OBJECTID === best.objectId
                );
                if (matchedFeature) {
                  response = [matchedFeature];
                }
              }   
              //if no preserve data, calculate bbox from trails - using layerId
              const geojson = getPreserveWithBBoxQuery({
                orgId,
                serviceName,
                layerId: preserveName === "walkmaps" ? 1 : 2,
                preserveName: preserveName,
                preserveBbox: BboxesMap[preserveName]
              });
              

              const trailData = await fetch(`${geojson}`);
              if (!trailData.ok || mapState.hasTrails === false) {
                hasTrails = false;
                return;
              } else {
                response = await trailData.json();
                hasTrails = response.features.length > 0;
              }
            } else  {
              if (preserveJson.features.length > 1) { 
                const best = pickBestBySlug(preserveJson.features, preserveName);
                if (best) {
                  const matchedFeature = preserveJson.features.find(
                    (f: any) => f.properties.OBJECTID === best.objectId
                  );
                  if (matchedFeature) {
                    response = matchedFeature;
                  }
                }
              } else {
                response = preserveJson.features[0];
              }
            }
        }

        const rawBbox = bbox(response)
        const Bbox = [
          [rawBbox[0], rawBbox[1]],
          [rawBbox[2], rawBbox[3]],
        ];

        if (!Bbox) return;

        setMapState(prev => ({
          ...prev,
          bbox: Bbox,
          hasTrails: hasTrails,
        }));
      }
    };


    //#Tamas 4 -  preserveName will be changed with something like "mapType" or similar...
    const fetchPreserveData = async () => {
      if (mapState.webMapName === null) {
        const geojson = getPreserveWithBBoxQuery({
          orgId,
          serviceName,
          layerId: 3,
          preserveName: preserveName,
          preserveBbox: BboxesMap[preserveName]
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

    fetchDataForBbox();
    fetchPreserveData();

  }, [preserveName,
    mapState,
    serviceName,
    orgId,
  ]);


  return (
    <MapContext.Provider value={{ mapState, setMapState }}>
      {children}
    </MapContext.Provider>
  );
}




//==============Webform Template Status Context
const TemplateStatusProvider = ({ children }: { children: ReactNode }) => {

  const [templatesStatus, setTemplatesStatus] = useState<TemplatesStatus>(InitialTemplateStates);

  const updateTemplateStatus = (templateId: string, newStatus: 'confirmed' | 'not_submitted') => {
    setTemplatesStatus(prevState => {
      const updatedTemplates = prevState.templates.map(template => {
        if (template.value === templateId) {
          return {
            ...template,
            status: newStatus,
          };
        } else {
          return template;
        }
      });

      return {
        ...prevState,
        templates: updatedTemplates,
      };
    });
  };

  const updateSessionId = (sessionId: string) => {
    setTemplatesStatus(prevState => {
      return {
        ...prevState,
        sessionId: sessionId,
      };
    }
    );
  };

  const updateValidated = (templateId: string, validated: boolean) => {
    setTemplatesStatus(prevState => {
      const updatedTemplates = prevState.templates.map(template => {
        if (template.value === templateId) {
          return {
            ...template,
            validated: validated,
          };
        } else {
          return template;
        }
      });

      return {
        ...prevState,
        templates: updatedTemplates,
      };
    }
    );
  };


  return (
    <TemplatesStatusContext.Provider value={{ data: templatesStatus, updateTemplateStatus, updateSessionId, updateValidated }}>
      {children}
    </TemplatesStatusContext.Provider>
  );
}

export {
  PreserveNameProvider,
  AppContextProvider,
  MapContextProvider,
  TemplateStatusProvider,
  PopupContextProvider
};
