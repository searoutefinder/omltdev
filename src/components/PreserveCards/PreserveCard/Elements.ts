import { HTMLAttributes } from 'react';
import styled, { keyframes, css } from 'styled-components';


interface DataCardAttr extends HTMLAttributes<HTMLDivElement> {
    'data-card': boolean;
}

export const CardContainer = styled.div.attrs<DataCardAttr>(() => ({
    'data-card': true,
})) <DataCardAttr>`
    display: flex;
    flex: 0 0 calc(30% - 10px);
    position: relative;
    top: 8px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 30%;
    min-width: 280px;
    max-width: 310px;
    height: 100%; 
    max-height: 520px;
    padding:18px;
    scroll-snap-align: start !important;
    // ---------
    gap: 2%;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 4px 0 rgba(160, 160, 160, 0.2);
    transition: 0.25s;
    
    &:hover {
        box-shadow: 0 8px 8px 0 rgba(136, 136, 136, 0.2);
        transform: scale(1.0025);
    }; 
    
    
    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        min-width: 310px;
        max-height: 500px; 
        flex: 0 0 calc(100% - 50px);
        gap:20px; 
        height:auto;
        scroll-snap-align: start !important;
        scroll-snap-stop: always;

        &:hover {
            box-shadow: 0 4px 4px 0 rgba(160,160,160,.20); 
            transform: none;                                
  }
    }


    //WIX -----------------------------------
    @media (max-width: 350px) {
        padding: 12px;
        min-width: 265px;
        flex-shrink: 0;
        gap:20px;
        height:auto;
        max-height: 500px;
        scroll-snap-align: start !important;
        scroll-snap-stop: always;

        &:hover {
            box-shadow: 0 4px 4px 0 rgba(160,160,160,.20); 
            transform: none;                                
  }
    }

    
        ::-webkit-scrollbar {
        width: 0.5em;
        height:12.5px;
        background-color: #F5F5F5;
        border-radius:15px;
        }

        ::-webkit-scrollbar-thumb {
        background-color: #c9c9c9;
        border-radius:15px;
        }
        ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
        box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);

        background-color: #F5F5F5;
        border-radius:15px;
    }
`;



export const ActivityBanner = styled.img`
    position: absolute;
    top:6%;
    left: 2%;
    width: 35%;
    height:auto;
    z-index: 50;

    @media (max-width: 1044px) {
        width: 35%;
    }

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        width: 30%;
    };

    //WIX -----------------------------------
    @media (max-width: 350px) {
        top: 4%;
        left:0px;
        width: 30%;
    };


    @media (max-height: 350px) {
        display: none;
    };
`

export const InsetMapContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22%;
    height: 22%;
    background: #f0f0f0;
`;

export const Header = styled.div`
  display:flex;
  width: 100%; 
  flex-direction: row;
  justify-content: flex-start;
  gap: 2.5%;

@media (max-width: 1024px) {  
   gap:2.5%;
}`;

export const Col1 = styled.div` 
 display:flex;
 width: 100%; 
 flex-direction: column;
 justify-content: flex-start;
 gap: 3px;

 @media (max-width: 1024px) {  
    gap:2px;
 }`;


export const Footer = styled.div`
    display:flex;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
 `

export const BadgeContainer = styled.div`
    position:relative;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    padding: 5px;
`

export const BadgeOne = styled.img`
    width:30px;
    height:auto;
    z-index:1;
`

export const BadgeTwo = styled.img`
    position: absolute;
    top: 5px;
    right:-2.5px;
    width: 18px;
    height: 18px;
    z-index: 2;
`

export const Title = styled.div`
    font-weight: 700;
    font-size: 22px;
    line-height: 22px;
    letter-spacing: -0.24px;
    color: #000;
   
    @media (max-width: 1024px) {
        font-size: 1.3rem;
    };
    
    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        font-size: 1.2rem;
    };
    
    //WIX -----------------------------------
    @media (max-width: 350px) {
        font-size: 1.0rem;
    };
 `;



export const SubTitle = styled.div`
    font-weight: 500;
    font-size: 16px;
    line-height: 14.72px;
    letter-spacing: -0.24px;
    max-width: 240px;

    @media (max-width: 1024px) {
        font-size: 1rem;
    };

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        font-size: 0.95rem;
    };

    //WIX -----------------------------------
    @media (max-width: 350px) {
        font-size: 0.85rem;
    };
 `

export const InfoContainer = styled.div<{ $hasTrailData: boolean | undefined }>` 
    display: ${(props) => props.$hasTrailData ? 'flex' : 'none'};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    width: 100%;
    height: auto;
`;


export const InfoItem = styled.div`
    display: flex;
    width: auto;
    height: auto;
    flex-direction: column;
    align-items: center;
    gap:4px !important;
`;


export const Value = styled.p`
    font-weight: 600;
    font-size: 18px;
    letter-spacing: -0.24px;
    margin:0;
    padding:0;

    @media (max-width: 1024px) {
        font-size: 1rem;
    }

    //WORDPRESS --------------------------------
    @media (max-width: 600px) {
        font-size: 0.95rem;
    };

    //WIX -----------------------------------
    @media (max-width: 350px) {
        font-size: 0.85rem;
    };
`;

export const Attribute = styled.p`
    font-weight: 500;
    font-size: 14px;
    margin:0;
    padding:0;
    color: #6F6F6F;


    @media (max-width: 1024px) {
        font-size: 0.85rem;
    }

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        font-size: 0.85rem;
    };

    //WIX -----------------------------------
    @media (max-width: 350px) {
        font-size: 0.80rem;
    };

`;

export const DescriptionContainer = styled.div<{
    $hasTrailData: boolean | undefined,
    $expanded: boolean,
    $atBottom: boolean
}>`
    display: flex;
    position: relative;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: ${(props) => props.$hasTrailData ? "15%" : "25%"};
    overflow-x: hidden;
    overflow-y: ${(props) => props.$expanded ? "auto" : "hidden"};
    background-color: white;
    /* text-overflow: ellipsis; */
    -webkit-overflow-scrolling: touch;


    @media (max-width: 600px) {
        height: 78px;
        mask-image: ${({ $expanded, $atBottom }) =>
        $expanded && !$atBottom
            ? 'linear-gradient(to bottom, black 80%, transparent 100%)'
            : 'none'};
        }
`

export const Description = styled.p`
    width: 100%;
    font-weight: 400;
    font-size: 16px;
    line-height: 19.8px;
    letter-spacing: -0.24px;
    color:#646262;
    padding:0;
    margin:0;

    @media (max-width: 1024px) {
        font-size: 1rem;
    };

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        font-size: 0.95rem;
        padding-bottom: 5px;
    };

    //WIX -----------------------------------
    @media (max-width: 350px) {
        font-size: 0.9rem;
        padding-bottom: 5px;
    };
`;


export const ShowMoreText = styled.span`
    font-size:16px;
    color: #4C8C2B;
    font-weight: 600;
    cursor: pointer;
    display:inline;
    margin-left: 5px;

    @media (max-width: 1024px) {
        font-size: 1rem;
    };

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        font-size: 0.9rem;
    };

    //WIX -----------------------------------
    @media (max-width: 350px) {
        font-size: 0.85rem;
    };

    &:hover {
        text-decoration: underline;
    };
`


const blink = keyframes`
  0%, 
  100% { opacity: 1;}
  50%  { opacity: 0.25; }
`;

export const ExploreButton = styled.div<{
    $isFocused: boolean
}>`
  display: flex;
  justify-content: center;
  width: 95%;
  border-radius: 10px;
  border-width: 1px;
  padding: 13px;
  background-color: #4C8C2B;
  color: #fff;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s,
    box-shadow 0.3s,
    transform 0.3s;
  font-size: 18px;
  box-shadow: ${({ $isFocused }) =>
        $isFocused
            ? '0 4px 16px 0 rgba(76,140,43,0.25)'
            : 'none'};
  transform: ${({ $isFocused }) =>
        $isFocused
            ? 'scale(1.04)'
            : 'scale(1)'};
  background-color: ${({ $isFocused }) =>
        $isFocused
            ? '#5cbf2a'
            : '#4C8C2B'};
  color: #fff;

  ${({ $isFocused }) => $isFocused && css`
      animation: ${blink} 0.6s linear 1;
  `}

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        font-size: 1rem;
    };

    //WIX -----------------------------------
    @media (max-width: 480px) {
        font-size: 0.95rem;
    };
`;


export const ExploreLink = styled.a`
  display: flex;
  width: 100%;
  text-decoration: none;
  color: white;
`;

//Activities Section-------------
export const Activities = styled.div`
    display: flex;
    width: 100%;
    margin:5px 0 15px 0;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
`;

export const ActivityIcon = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 1px;

    @media (max-width: 1024px) {
        width: 28px;
        height: 28px;
    };

    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        width: 24px;
        height: 24px;
    };
`;

