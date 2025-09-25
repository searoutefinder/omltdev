export type Bbox = [[number, number], [number, number]];
export type Point = [number, number] | null;


export interface DonationInfoProps {
    template: string | null;
    donation_object: string | null;
    donation_url: string | null;
    donation_url_text: string | null;
    donation_text: string | null;
    contact_email: string | null;
    POI_type? : string | null;
    activity: string | null;
}


export interface PopupDataItem {
    featureId: number | string | null;
    popupCoordinates: [number, number][];
    name?: string;
  }


export interface ImageProps { 
    url: string;
    name: string;
  };
  