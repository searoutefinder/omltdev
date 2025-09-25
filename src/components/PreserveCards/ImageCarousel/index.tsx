import React, { useRef, useState, useMemo, useCallback } from 'react'
//types
import { ImageCarouselProps, ImageProps } from '../../../types/cards';
//styles
import {
  ImageCarouselContainer,
  ImagesWrapper,
  HeroImage,
  MapThumbnail,
  Arrow,
} from './Elements';
import { DotsContainer, Dot } from '../../Sidebars/RightSidebar/components/ImageCarousel/Elements';
//utils
import { handleTouchStart, handleTouchMoveCarousel, handleTouchEndCarousel } from '../../../utils/Gestures/Sidebar';




export const ImageCarousel = ({
  isMobile,
  imageURLs,
  insetMapURL, 
  exploreHref,
  setIsMapHovered
} : ImageCarouselProps) => {
  //refs
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);

  //states
  const [translateX, setTranslateX] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);


  //handlers ------------------------------------------------------------
  const handleNext = useCallback((images: ImageProps[]) => {
    if (images) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  }, []);

  
  const handlePrev = useCallback((images: ImageProps[]) => {
    if (images) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  }, []);
  

 // memoized values for image URLs and map thumbnail URL
  const imageURLsMemo :any = useMemo(
    () => (imageURLs?.length > 0 ? imageURLs : 
      [{ name: 'placeholder', 
         url: '/img/raster/PreserveCards/carousel_placeholder.png'
      }]),
    [imageURLs]
  );
  
  const mapThumnbnailUrlMemo : any = useMemo(
    () => insetMapURL || '/img/raster/PreserveCards/insetmap_placeholder.png',
    [insetMapURL]
  );
 
  //fix - delete hasTrailData and just boolean from insetMapURL
  return (
    <ImageCarouselContainer
       data-noswipe
    >
      <MapThumbnail 
        $hasTrailData={mapThumnbnailUrlMemo}
        $imageUrl={mapThumnbnailUrlMemo}
        onClick={() => {
          if (window.top && typeof exploreHref === 'string') {
            window.top.location.href = exploreHref;
          }
        }}
        onMouseEnter={() => {setIsMapHovered(true)}}
        onMouseLeave={() => { setIsMapHovered(false)}
      
      }
        />
      <Arrow
        $isMobile={isMobile}
        style={{ 
          left: '5px', 
          visibility: 
          (isMobile && currentIndex > 0) ? 'visible' 
          : (currentIndex > 0) ? 'visible' : 'hidden' 
        }}
        src={'img/vector/RightSidebar/leftArrow.svg'}
        onClick={() => handlePrev(imageURLsMemo)}
      />
      <Arrow
        $isMobile={isMobile}
        style={{ 
          right: '5px', 
          visibility: 
          (isMobile && currentIndex < imageURLsMemo?.length - 1) ? 'visible' 
          : (currentIndex < imageURLsMemo?.length - 1) ? 'visible' : 'hidden' }
        }
        src={'img/vector/RightSidebar/rightArrow.svg'}
        onClick={() => handleNext(imageURLsMemo)}
      />
      <ImagesWrapper
        $activeIndex={currentIndex}
        $translateX={translateX}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleTouchStart(e, { startX })}
        }
        onTouchMove={(e) => {
          e.stopPropagation();
          handleTouchMoveCarousel(e, { startX, setTranslateX, currentIndex, imagesLength: imageURLsMemo?.length })}
        }
        onTouchEnd={(e) =>
        {
          e.stopPropagation();
          handleTouchEndCarousel({
            startX,
            currentX,
            currentIndex,
            imagesLength: imageURLsMemo?.length,
            translateX,
            setCurrentIndex,
            setTranslateX,
          })
        }
          
        }
      >
        {imageURLsMemo.map((img: any, index: number) => (
          <HeroImage
            key={index}
            src={img.url}
            loading = "lazy"
            fetchPriority= {index === 0 ? 'high' : 'low'}
            alt={`Image ${img.name + 1}`}
          />
        ))}
      </ImagesWrapper>
      <DotsContainer>
        {imageURLsMemo.map((url: any, index: number) => (
          <Dot
            key={index}
            $active={index === currentIndex}
          />
        ))}
      </DotsContainer>
    </ImageCarouselContainer>
  )
}
