import { useEffect, useMemo, startTransition } from "react";
import { CacheImageEntry,  ImageFetcherProps } from "../../../types/cards";
import { getEndpoints } from "../../../constants/AGOL/preserve-maps/api";
import { getAttachmentsByObjectId } from "../../../constants/AGOL/cards/api";
import { logoRegex, insetRegex } from "../../../constants/REGEX/images";


const imgCache = new Map<string, CacheImageEntry>();

export const useImageFetcher = ({
  orgId,
  serviceName,
  objectId,
  setLogoURL,
  setImageURLs,
  setInsetMapURL,
  setIsCardReady,
}: ImageFetcherProps) => {
    
  const cacheKey = useMemo(
    () => `${orgId ?? "all"}-${serviceName ?? "all"}-${objectId ?? "none"}`,
    [orgId, 
     serviceName, 
     objectId]
  );

  useEffect(() => {
    if (!objectId) return;

    const cached = imgCache.get(cacheKey);
    if (cached) {
      startTransition(() => {
        setImageURLs(cached.images);
        setLogoURL(cached.logos);
        setInsetMapURL(cached.inset);
        setIsCardReady(true);
      });
      return; 
    }

    const controller = new AbortController();

    const fetchImages = async () => {
      try {
        const attachments = await getAttachmentsByObjectId({
          objectId: objectId,
          baseURL: getEndpoints(orgId, serviceName).preserve.url,
          queryField: getEndpoints(orgId, serviceName).preserve.queryField,
          signal: controller.signal,
        });

        const images = attachments.filter(
          (a: any) => !logoRegex.test(a.name) && !insetRegex.test(a.name)
        );
        //get and set path for logos
        const logos = attachments.filter((a: any) => logoRegex.test(a.name));
        //get and set path for inset map
        const insetObj = attachments.find((a: any) => insetRegex.test(a.name));
        const inset = insetObj ? insetObj.url : null;
        
        imgCache.set(cacheKey, { images, logos, inset });

        startTransition(() => {
          setImageURLs(images);
          setLogoURL(logos);
          setInsetMapURL(inset);
          setIsCardReady(true);
        });
      } catch (err) {
        if (controller.signal.aborted) return; // ignore cancel
        console.error("Image fetch error:", err);
      }
    };

    fetchImages();

    return () => controller.abort(); // cleanup
  }, [cacheKey, 
     serviceName, 
     orgId, 
     objectId, 
     setImageURLs, 
     setLogoURL, 
     setInsetMapURL, 
     setIsCardReady
    ]); 
};
