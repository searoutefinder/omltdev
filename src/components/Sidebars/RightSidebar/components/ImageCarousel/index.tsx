import React, { useState, useRef, MouseEvent} from 'react';
import { CarouselContainer, CarouselWrapper, Arrow, Slide, Image, Dot, DotsContainer } from './Elements';
import { handleTouchStart, handleTouchMoveCarousel, handleTouchEndCarousel } from "../../../../../utils/Gestures/Sidebar";
import { CloseIcon } from '../../RightSidebarElements';
import { ImageProps } from '../../../../../types/walk-maps';


interface ImageCarouselProps {
    isMobile: boolean;
    images : ImageProps[];
    handleToggle: (e: MouseEvent) => void;
}

export const ImageCarousel = ({ isMobile, images, handleToggle }: ImageCarouselProps) => {
    
    //refs 
    const startX = useRef<number | null>(null);
    const currentX = useRef<number | null>(null);

    //states
    const [translateX, setTranslateX] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
   
    const handleNext = () => {
        if (images) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };
    
    const handlePrev = () => {
        if (images) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        };
    };
      
     if (images?.length === 0) return null;

    return (
        <CarouselContainer>
            <CloseIcon
                src={'/img/vector/RightSidebar/closeIcon.svg'}
                onClick={handleToggle}
            />
            <Arrow
                $mobile={isMobile}
                style={{ left: '5px', visibility: (currentIndex > 0) ? 'visible' : 'hidden' }}
                src={'/img/vector/RightSidebar/leftArrow.svg'}
                onClick={handlePrev}
            />
            <Arrow
                $mobile={isMobile}
                style={{ right: '5px', visibility: (currentIndex < images.length - 1) ? 'visible' : 'hidden' }}
                src={'/img/vector/RightSidebar/rightArrow.svg'}
                onClick={handleNext}
            />
            <DotsContainer>
                {images?.map((_, index) => (
                    <Dot
                        key={index}
                        $active={index === currentIndex}
                    />
                ))}
            </DotsContainer>

            <CarouselWrapper
                $activeIndex={currentIndex}
                $translateX={translateX}
                onTouchStart={(e) => handleTouchStart(e, { startX })}
                onTouchMove={(e) => handleTouchMoveCarousel(e, { startX, setTranslateX, currentIndex, imagesLength: images.length })}
                onTouchEnd={() =>
                    handleTouchEndCarousel({
                        startX,
                        currentX,
                        currentIndex,
                        setCurrentIndex,
                        imagesLength: images.length,
                        translateX,
                        setTranslateX,
                    })
                }
            >
                {images.map((image, index) => (
                    <Slide key={index}>
                        <Image src={image.url} alt={`Slide ${index}`} />
                    </Slide>
                ))}
            </CarouselWrapper>
        </CarouselContainer>
    );
};
