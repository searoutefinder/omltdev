import styled from "styled-components";


export const Arrow = styled.img<{ $mobile: boolean }>`
 position: absolute;
 visibility: visible;
 width:30px;
 height:30px;
 top:40%;
 z-index:2;
 cursor: pointer;
 opacity:  ${(props) => props.$mobile ? 1 : 0};
 transition: ${(props) => props.$mobile ? "none" : "opacity 0.5s ease-in-out"}; 

  @media (max-width: 785px) { 
     width: 24px;
     height: 24px;
  };

  @media (max-width: 510px) { 
      width: 22px;
      height: 22px;
    };

`

export const CarouselContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 35% !important;
  justify-content: center;
  background-color: white;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;
  touch-action: none;
  overflow: hidden;
  transition: height 0.5s ease-in-out, transform 0.5s ease-in-out;

  &:hover ${Arrow} { 
   opacity:1;
  }
  
  @media (max-height: 569px) {
   display: none;
  };
`;

interface CarouselWrapperProps {
  $activeIndex: number;
}

export const CarouselWrapper = styled.div<CarouselWrapperProps & { $translateX: number }>`
  display: flex;
  width: 100%;
  height:100%;
  transition: ${(props) => props.$translateX === 0 ? "transform 0.5s ease-in-out" : "none"};
  transform: ${(props) => `translateX(calc(-${props.$activeIndex * 100}% + ${props.$translateX}px))`};
`;


export const Slide = styled.div`
  flex: 0 0 100%;
  position: relative;
  width: 100%;
  &::before {
    content: "";
    display: block;
    padding-top: 50%;
  }
`;

export const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


export const DotsContainer = styled.div`
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    bottom: 15px; 
    gap: 8px; 
    z-index: 20;
`;

export const Dot = styled.div<{ $active: boolean }>`
    width:  5px;
    height: 5px; 
    border-radius: 50%;
    background-color: ${({ $active }) => ($active ? "#FFFFFF" : "#BABBAA")}; 
    //transforms-----
    transition: 
        width 0.3s ease,
        height 0.3s ease,
        background-color 0.3s ease,
        transform 0.3s ease;
    cursor: pointer;
    transform: ${({ $active }) => ($active ? "scale(1.45)" : "scale(1)")};
`;
