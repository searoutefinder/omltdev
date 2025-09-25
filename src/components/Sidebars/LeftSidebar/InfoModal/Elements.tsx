import styled from 'styled-components';

export const Container = styled.div<{ $isOpen: boolean }>`
    position: absolute;
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: auto;
    height: auto;
    right: -35%;
    top: 105px !important;
    max-width: 250px;
    max-height: ${props => props.$isOpen ? '210px' : '0'};
    z-index: 100;
    
    @media (max-width: 1200px) {
        right: -35%;
    }

    @media (max-width: 1046px) {
        top:100px !important;
        right: -38%;
    }


    @media (max-width: 1024px) {
        top:102px !important;
        right: -35%;
    }
 


    @media (max-width: 826px) {
        top: 105px !important;
        right: -45%;
    }
 

    @media (max-width: 785px) {
        top: 78px !important;
        right: -15px;
    }

    @media (max-width: 665px) {  
      right: -15px;
    };
    

    @media (max-width: 480px) {  
        left:0;
        top:52px !important;  
        width: 94%;
        height:94%;
        margin-top:12.5px;
        padding:10px;
        justify-content: flex-start;
        align-items: center;
        max-width: 100%;
        max-height: 100%;
    };
    
    

    @media (max-width: 350px) {  
        top:42px !important;  
    };   
`

interface CarouselWrapperProps {
    $activeIndex: number;
}

export const CarouselWrapper = styled.div<CarouselWrapperProps & { $translateX: number }>`
  display: flex;
  transition: ${(props) => props.$translateX === 0 ? "transform 0.5s ease-in-out" : "none"};
  //#fix key frames 
  transform: ${(props) =>`translateX(calc(-${props.$activeIndex * 100}% + ${props.$translateX}px))`};
`;



export const Arrow = styled.img`
   position:absolute;
   width: 24px;
   height: 12px; 
   margin-left: 20px;
   margin-top:-9px;
   padding: 0px;
   z-index:50 !important;

   @media (max-width: 785px) { 
        margin-left:75%;
        margin-bottom:-3px;
        opacity:1;
    };  
`

export const ContentWrraper = styled.div`
    display:flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin:0;
    width:auto;
    height:auto;
    z-index:2 !important;

    
@media (max-width: 480px) { 
    border: 1px solid #e9e9e9;
    padding:0px;
    border-radius: 8px !important;
    box-shadow: 2px 6px 10px 1px #0000001a !important;
    background-color: #fff;
}`


export const InfoModalContent = styled.div<{ $expandedserviceName: number | null }>`
 display:flex;
 flex-direction: column;
 gap: ${({ $expandedserviceName }) => ($expandedserviceName ? "13px" : "18px")};
 border: 1px solid #EDEDED;
 padding:16px;
 border-radius: 8px !important;
 background-color: #fff;
 box-shadow: 5px 8px 18px -3px #0000001A !important;
 z-index: 5 !important;

 @media (max-width: 480px) { 
  gap: ${({ $expandedserviceName }) => ($expandedserviceName ? "20px" : "28px")};
  border-radius: 0 !important;
  box-shadow: none !important;
  border: none !important;
  background-color: transparent;
}`



export const InfoModalFooter = styled.div` 
    display:none;
    width:100%;
    flex-direction: row;
    justify-content: flex-end;
    padding: 10px 0px;
    border-radius: 0 0 8px 8px;
    background-color: #e9e9e9;
    z-index:1;

    
    @media (max-width: 480px) {
        display:flex;
    };
`

export const CloseModal = styled.div`
    margin:0;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    color: #464646;
    border: 1px solid #bebebe;
    padding:5px 10px;
    border-radius:10px;

    @media (max-width: 480px) { 
        display:flex;
        font-size: 0.80rem;
        margin-right:20px;
    }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  };

  @media (max-width: 350px) {
    font-size: 0.75rem;
  }  
`

export const InfoModalItem = styled.div<{ $isExpanded: boolean }>`
 display:flex;
 flex-direction: column;
 padding: 0;
 margin:0;
 gap:8px;
 max-height: ${({ $isExpanded }) => ($isExpanded ? "400px" : "60px")}; 
 transition: max-height .6s ease-out; 

`

export const InfoModalItemTitleWrapper = styled.div`
    display:flex;
    width:100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    vertical-align: middle;
    gap: 8px;
    padding: 0;
    margin:0;
`


export const InfoModalItemTitle = styled.p`
  font-size: 16px;
  font-weight:600;
  color: #000000;
  padding:0;
  margin:0;

  @media (max-width: 768px) {
     font-size: 0.85rem;
  };

  @media (max-width: 480px) {
    font-size: 0.8rem;
  };

  @media (max-width: 350px) {
    font-size: 0.8rem;
  }
`
export const InfoModalItemText = styled.p` 
    font-size: 14px;
    font-weight: 400;
    line-height: 1.1;
    color:#646262;
    padding: 0;
    margin:0;


 @media (max-width: 768px) {
    font-size: 0.80rem;
  };

  @media (max-width: 480px) {
    font-size: 0.75rem;
  };

  @media (max-width: 350px) {
    font-size: 0.75rem;
  }  
`



export const ReadMore = styled.div`
    display: flex;
    position: relative;
    bottom: 2px;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    color: #4C8C2B;
    font-weight: 500;  
    gap: 3.5px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    padding:0;
    margin:0;

    &:hover { 
        color: #94c57a;
        transition: all .3s ease;
    }

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -4px; 
        height: 1px;
        width: 100%;
        background-color: #4C8C2B;
        padding: 0; 
    }

    @media (max-width: 480px) { 
        display:none;
    }
`;

export const GreenArrow = styled.img<{ $isExpanded: boolean }>`
    width: 11px;
    height: 11px;
    margin-left: 3.5px;
    margin-bottom: -1.5px !important;
    transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
    transition: transform 0.3s ease;
`;
