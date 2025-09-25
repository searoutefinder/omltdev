import { useEffect, useRef, startTransition } from 'react';
import { DonationInfoProps, ImageProps } from '../../types/preserve-map';
import { getEndpoints} from '../../constants/AGOL/preserve-maps/api';
import { getAttachmentsByObjectName, getAttachmentsByObjectId} from '../../constants/AGOL/cards/api';
import { logoRegex, insetRegex} from '../../constants/REGEX/images';
import { pickBestBySlug } from '../../utils/Text';


interface FetchImagesProps {
  styleLoaded: boolean;
  dataLoaded: boolean;
  donationInfo: DonationInfoProps | null;
  activePreserve: string | null;
  masterTable: any;
  setImages: (images: ImageProps[]) => void;
  setLogoURL: (logoURL: ImageProps[]) => void;
}




//#fix - clean this up into few hooks and merge with donation Info hook
export const ImageFetcher = ({ styleLoaded, dataLoaded, donationInfo, activePreserve, masterTable, setImages, setLogoURL }: FetchImagesProps) => {

  // ---------------- REFS ----------------
  const hasFetchedImages = useRef(false);
  const hasFetchedLogo = useRef(false);

  // ---------------- RESETTERS ----------------

  //1. Reset hasFetched when Donation Info changes
  useEffect(() => {
    if (donationInfo) {
      hasFetchedImages.current = false;
    };
  }, [donationInfo]);


  //2. Reset hasFetched when Active Preserve changes
  useEffect(() => {
    if (activePreserve) {
      hasFetchedLogo.current = false;
    };
  }, [activePreserve]);


  // ----------------- FETCHERS ---------------------

  //3. Fetch images for donation card 
  useEffect(() => {
    if (styleLoaded 
        && dataLoaded 
        && !hasFetchedImages.current 
        && donationInfo) {

      //#donation properties 
      const objectName = donationInfo.donation_object;
      const baseURL = donationInfo.template === 'trails' ? getEndpoints().trails.url : getEndpoints().pois.url;
      const queryField = donationInfo.template === 'trails' ? getEndpoints().trails?.queryField : getEndpoints().pois?.queryField;

      const fetchImages = async () => {
        try {
          const attachments = await getAttachmentsByObjectName({
            objectName: objectName,
            baseURL: baseURL,
            queryField: queryField,
          });

          const images = attachments.filter(
           (a: any) => !logoRegex.test(a.name) && !insetRegex.test(a.name)
        );

          startTransition(() => {
            setImages(images);
          })

          hasFetchedImages.current = true;
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };

      if (!hasFetchedImages.current) {
        fetchImages();
      };
    }

  }, [dataLoaded,
     donationInfo,
     styleLoaded,
     setImages
  ]);


  //4. Fetch Logo Image for Left Panel
  useEffect(() => {
  if (
    styleLoaded &&
    dataLoaded &&
    !hasFetchedLogo.current &&
    activePreserve &&
    masterTable?.features?.length
  ) {
    const fetchLogoURL = async () => {
      const targetName = activePreserve;
      const features = masterTable.features;

      // 1. fuzzy match in GeoJSON
      const best = pickBestBySlug(features, targetName);

      const findObjectId = best?.objectId ?? null;

      if (!findObjectId) {
        console.warn("[logo] No fuzzy match (OBJECTID not found).");
        hasFetchedLogo.current = true;
        return;
      }

      try {
        // 2. fetch attachments for the best-matched OBJECTID
        const attachments = await getAttachmentsByObjectId({
          objectId: findObjectId,
          baseURL: getEndpoints().masterTable.url,
          queryField: getEndpoints().masterTable.queryField,
        });

        // 3. filter only logo files (based on your regex)
        const logos = attachments.filter((a:any) => logoRegex.test(a.name));
       
        // 4. Update state with the fetched logos
        startTransition(() => 
          setLogoURL(logos)
       );

        hasFetchedLogo.current = true;
      } catch (error) {
        console.error("[logo] Error fetching images:", error);
        hasFetchedLogo.current = true;
      }
    };

    fetchLogoURL();
  }
}, [
  masterTable,
  dataLoaded,
  styleLoaded,
  activePreserve,
  setLogoURL,
]);

  return null;
};



