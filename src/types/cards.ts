export interface CardDataProps {
  OBJECTID: number;
  preserve_name: string;
  owner: string;
  imageUrls: string[];
  alt: string;
  total_distance: number | null;
  dominant_surface: string | null;
  elevation_gain: number | null;
  preserve_description: string;
  allowed_acts: string[] | null;
  prohibited_acts: string[] | null;
  dominant_activity: string | null;
  preserve_page_url: string | null;
}

export interface PreserveCardProps {
  key: number;
  card: CardDataProps;
  isMobile: boolean;
  orgId: string | null; 
  serviceName: string | null; 
}


export interface ImageProps {
    id?: number; 
    url: string;
    name: string;
  };
  
  
export interface GetImagesProps {
  objectId: number | null;
  baseURL: string | null;
  queryField: string | null;
  signal?: AbortSignal | null;
};


export interface GetImagesPropsDonation {
  objectName: string | null;
  baseURL: string | null;
  queryField: string | null;
  signal?: AbortSignal | null;
};

export interface ActivitiesSectionProps {
  allowedActs: any;
  prohibitedActs: any;
};


export interface ImageCarouselProps {
  isMobile?: boolean;
  // hasTrailData: boolean | undefined;
  imageURLs: ImageProps[];
  insetMapURL: string | null;
  exploreHref: string | null; // URL to explore the preserve
  setIsMapHovered: (isHovered: boolean) => void; // function to set inset map hovered state
}
  

export interface ImageFetcherProps {
    orgId: string | null; //org id
    serviceName: string | null; //client id/item id
    objectId: number | null;
    setLogoURL: (logoURL: ImageProps[]) => void;
    setImageURLs: (imageURLs: ImageProps[]) => void; //set image URLs for carousel
    setInsetMapURL: (mapThumbnailUrl: string | null) => void; // map thumbnail
    setIsCardReady: (b: boolean) => void;
}


export type CacheImageEntry = {
   images: ImageProps[];
   logos: ImageProps[];
   inset: string | null;
};
