const typeQuery = '/query?f=geojson&outFields=*&where=1=1';
const bboxQuery = '&geometry='

//================ URL STRUCTURE =========================
const getBaseURL = (orgId: string, serviceName: string) =>
    `https://services9.arcgis.com/${orgId}/arcgis/rest/services/${serviceName}/FeatureServer/`;


//================ URL STRUCTURE WITH BBOX =========================
interface ConstructUrlProps {
    orgId: string;
    serviceName: string;
    layerId: number;
    preserveName?: string | null;
    preserveBbox: number[][];
}

export const getPreserveWithBBoxQuery = ({
    orgId,
    serviceName,
    layerId,
    preserveBbox,
}: ConstructUrlProps) => {
    const baseURL = getBaseURL(orgId, serviceName);
    const fullURL = `${baseURL}${layerId}${typeQuery}${bboxQuery}${preserveBbox}`;
    return fullURL;
}


//================ URL STRUCTURE NO BBOX =========================
interface ConstructUrlNoBBoxProps {
    orgId: string | null;
    serviceName: string | null;
    layerId: number | null;
};

export const constructUrl = ({
    orgId,
    serviceName,
    layerId
}: ConstructUrlNoBBoxProps) =>  {
    if (!orgId || !serviceName) {
        return
    }
    const baseURL = getBaseURL(orgId, serviceName);
    return `${baseURL}${layerId}${typeQuery}${bboxQuery}`;
}

//================ ENDPOINTS =====================================
type Endpoints = {
    preserve: { url: string; queryField: string };
    masterTable: { url: string; queryField: string };
    masterTableMaps: { url: string; queryField: string };
    trails: { url: string; queryField: string };
    pois: { url: string; queryField: string };
};

export const getEndpoints = (
    orgId: any = "TkSpD6kCAXkp8Jk5",
    serviceName: any = "LGLC_OMLT"
): Endpoints => {
    const baseURL = getBaseURL(orgId, serviceName);
    return {
        preserve: { url: `${baseURL}5/`, queryField: "OBJECTID" },
        masterTable: { url: `${baseURL}5/`, queryField: "OBJECTID" },
        masterTableMaps: { url: `${baseURL}5/`, queryField: "preserve_name" },
        trails: { url: `${baseURL}5/`, queryField: "donation_object" },
        pois: { url: `${baseURL}5/`, queryField: "donation_object" }
    };
};
