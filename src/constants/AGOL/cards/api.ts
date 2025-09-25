import { GetImagesProps, GetImagesPropsDonation, ImageProps } from "@/types/cards";


export const getMasterTableData = async (
    orgId: string,
    serviceName: string) => {
    if (!serviceName) return null;

    const response = await fetch(`https://services9.arcgis.com/${orgId}/arcgis/rest/services/${serviceName}/FeatureServer/5/query?where=1%3D1&outFields=*&f=json`);
    if (!response.ok) {
        console.error("Failed to fetch master table data");
        return null;
    }

    const data = await response.json();
    return data.features?.map((f: any) => f.attributes) || [];

}


//==== Fetches images by object ID, used for properties and preserves
export const getAttachmentsByObjectId = async ({
    objectId,
    baseURL,
    queryField,
    signal,
}: GetImagesProps) => {
    
    if (!objectId || !baseURL || !queryField) return [];

    const queryUrl = `${baseURL}/query?where=${queryField}='${encodeURIComponent(
        objectId
    )}'&outFields=OBJECTID&f=json`;

    const queryRes = await fetch(queryUrl, { signal });
    const queryData = await queryRes.json();
    if (!queryData.features?.length) return [];

    const attachUrl = `${baseURL}queryAttachments?objectIds=${objectId}&f=json`;
    const attachRes = await fetch(attachUrl, { signal });
    const attachData = await attachRes.json();
    if (!attachData.attachmentGroups?.length) return [];

    return attachData.attachmentGroups[0].attachmentInfos.map(
        (a: ImageProps) => ({
            url: `${baseURL}/${objectId}/attachments/${a.id}`,
            name: a.name,
        })
    );
};



//=== Fetches images by object name, used for donations
export const getAttachmentsByObjectName = async ({
    objectName,
    baseURL,
    queryField,
    signal,
}: GetImagesPropsDonation) => {
    if (!objectName 
        || !baseURL 
        || !queryField) return [];
    const queryUrl = `${baseURL}query?where=${queryField}='${objectName}'&outFields=OBJECTID&f=json`;
        console.log("queryUrl", queryUrl);
    const queryRes = await fetch(queryUrl, { signal });
    const queryData = await queryRes.json();
    if (!queryData.features?.length) return [];

    const objectId = queryData.features[0].attributes.OBJECTID; 
    console.log("objectId", objectId);  
    const attachUrl = `${baseURL}queryAttachments?objectIds=${objectId}&f=json`;
    const attachRes = await fetch(attachUrl, { signal });
    const attachData = await attachRes.json();
    if (!attachData.attachmentGroups?.length) return [];

    return attachData.attachmentGroups[0].attachmentInfos.map(
        (a: ImageProps) => ({
            url: `${baseURL}/${objectId}/attachments/${a.id}`,
            name: a.name,
        })
    );
};
