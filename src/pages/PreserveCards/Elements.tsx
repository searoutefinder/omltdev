import styled from "styled-components";


export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    max-height: 660px;
 

    //hide cards if iframe conatiner is less than in docs: 660px 
    @media (max-height: 600px) {
        display: none;
    }     
    
    @media (max-width: 1024px) {
        max-height: 660px;
    };

    @media (max-width: 600px) {
        width:auto;
        max-height: 100%;
        justify-content: center;
        overflow: hidden;
        -webkit-overflow-scrolling: touch; 
    }

`;

export const CardsWrapper = styled.div<{
    $isLastPage: boolean;
    $isMobile?: boolean;
    $cardsPerPage: number;
}>`
        display: inline-flex;
        position: relative;
        width: 100%;
        height: 100%;
        flex-direction: row;
        justify-content: ${({ $isLastPage, $cardsPerPage }) =>
        $cardsPerPage === 1
            ? 'center'
            : $isLastPage
                ? 'flex-start'
                : 'space-between'};
        gap: ${({ $isLastPage, $isMobile }) => (($isLastPage && !$isMobile) ? '20px' : '5px')};
        align-items: center;
        overflow: hidden;
        overscroll-behavior: contain;
        overscroll-behavior-x: contain;

 
    //MOBILE LANDSCAPE --------------------
    @media (max-width: 1440px) and (orientation: landscape) {
        overflow-x: hidden;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
     }    


    //WORDPRESS -----------------------------------
     @media (max-width: 600px) {
        max-height: 100%;
        max-width: auto;
        flex-direction: row;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
    }

    //WIX -------------------------------------
    @media (max-width: 350px) {
        max-height:100%;
        max-width: auto;
        flex-direction: row;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
    }


   scrollbar-width: none;         
  -ms-overflow-style: none;      

  &::-webkit-scrollbar {         
    width : 0;
    height: 0;
    display: none;               
  }
`;


export const NavArrow = styled.button<{
    side: 'left' | 'right'
}>`
    position: absolute;
    top: 35%;
    display: flex; 
    ${({ side }) => (side === 'left' ? 'left: 1px;' : 'right: 1px;')}
    transform: translateY(-50%);
    width: 55px; 
    height: 55px;
    border: none; 
    border-radius: 50%;
    background-color: #ffffffb5;
    border: 2px solid #4C8C2B;
    color: white;
    justify-content: center; 
    align-items: center;
    font-size: 25px;
    line-height: 1;
    z-index: 99; 
    user-select: none;

  &:hover {
    background-color: #7aa3668d;
    cursor: pointer;
    }


      //WORDPRESS -----------------------------------
     @media (max-width: 600px) {
            top: 50%;
            ${({ side }) => (side === 'left' ? 'left: 2px;' : 'right: 10px;')}
    }

    //WIX -------------------------------------
    @media (max-width: 350px) {
            top: 50%;
            width: 43px;
            height: 43px;
            ${({ side }) => (side === 'left' ? 'left: 2px;' : 'right: 0px;')}
    }

`;


export const NavArrowIcon = styled.img`
  width: 24px;
  height: 24px;
  transition: filter 0.3s ease;
  z-index: 100;
`;










