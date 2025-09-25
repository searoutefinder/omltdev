import styled from "styled-components";


export const Arrow = styled.img<{
   $isMobile: boolean | undefined;
   }>`
   position:absolute;
   width: 25px;
   height: auto; 
   margin-top:-9px;
   padding: 0px;
   z-index:25 !important;
   transition: 0.3s;
   cursor: pointer;
   opacity: ${(props) => props.$isMobile ? 1 : 0};
   transform: ${(props) => props.$isMobile ? 'scale(1.25)' : 'none'};

   &:hover {
       opacity: 0.85;
       transform: scale(1.2); 
    };
    `

export const ImageCarouselContainer = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    height: 35%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 15px;
    touch-action: pan-y;  
    overscroll-behavior: contain;
    

    &:hover ${Arrow} { 
      opacity:1;
     };

     @media (max-width: 1024px) {  
        height: 38%;
    };

    @media (max-width: 768px) {
        height: 185px !important;
    };

    @media (max-height: 480px) {
        display: none;
    };
`

interface CarouselWrapperProps {
    $activeIndex: number;
}


export const ImagesWrapper = styled.div<CarouselWrapperProps & { $translateX: number }>`
  display: flex;
  position:relative;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  transition: ${(props) => props.$translateX === 0 ? "transform 0.5s ease-in-out" : "none"};
  transform: ${(props) => `translateX(calc(-${props.$activeIndex * 100}% + ${props.$translateX}px))`};
`;


export const HeroImage = styled.img`
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;


export const MapThumbnail = styled.div<{ 
    $imageUrl: string
    $hasTrailData: boolean | undefined;
    }>`
    position: absolute;
    display: ${(props) => props.$hasTrailData ? 'block' : 'none'};
    bottom: 11%;
    right: 10.5%;
    width: 65px;
    height: 65px;
    border-radius: 6.1px;
    object-fit: cover;
    border: 1px solid #ffffffe6;
    cursor: pointer;
    background-image: url(${(props) => props.$imageUrl});
    background-size: 200%;
    background-position: center;
    transition: transform 0.3s, bottom 0.3s, background-size 0.3s;
    z-index: 50;
    object-fit: cover;

    &:hover {
    transform: scale(1.85) translateY(-15px) translateX(-10px);
    background-size: 100%;
    z-index: 100; 
    }

    &:hover ~ ${Arrow} {
        opacity: 0;
    }

    @media (max-width: 768px) {
        width: 65px;
        height: 65px;
        right:10%;
        bottom: 15.5% !important;
    }
`;
