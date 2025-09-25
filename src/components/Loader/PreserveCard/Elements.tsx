import styled, { keyframes, css } from "styled-components";

export const CardContainer = styled.div.attrs({
})`
    display: flex;
    flex: 0 0 calc(30% - 10px);
    position: relative;
    top: 8px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 30%;
    height: 100%; 
    min-width: 280px;
    max-width: 310px;
    max-height: 500px;
    padding:18px;
    scroll-snap-align: start;
    // ---------
    gap: 2%;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 4px 0 rgba(160, 160, 160, 0.2);
    transition: 0.25s;
    
    &:hover {
        box-shadow: 0 8px 8px 0 rgba(136, 136, 136, 0.2);
        transform: scale(1.005);
    }; 
    
    //WORDPRESS -----------------------------------
    @media (max-width: 600px) {
        min-width: 310px;
        max-height: 500px; 
        flex: 0 0 calc(100% - 50px);
        gap:20px; 
        height:auto;
    }


    //WIX -----------------------------------
    @media (max-width: 350px) {
        padding: 12px;
        min-width: 265px;
        flex-shrink: 0;
        gap:20px;
        height:auto;
        max-height: 500px;
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




/* ---------- skeleton base ---------- */
const shimmer = keyframes`
  0%   { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

export const skeleton = css`
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e6e6e6 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

/* ---------- placeholders ---------- */
export const BannerPlaceholder = styled.div`
  ${skeleton};
  position: absolute;
  top: 6%;
  left: 2%;
  width: 35%;
  height: 28px;
  border-radius: 6px;
  z-index: 50;
`;

export const TopImagePlaceholder = styled.div`
  ${skeleton};
  width: 100%;
  height: 35%;
  border-radius: 14px;
`;


export const BadgePlaceholder = styled.div`
  ${skeleton};
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const TitlePlaceholder = styled.div`
  ${skeleton};
  width: 70%;
  height: 18px;
  border-radius: 4px;
  margin-bottom: 6px;
`;

export const SubTitlePlaceholder = styled.div`
  ${skeleton};
  width: 50%;
  height: 14px;
  border-radius: 4px;
`;

export const MetricPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 30%;
`;

export const MetricValue = styled.div`
  ${skeleton};
  width: 60%;
  height: 14px;
  border-radius: 4px;
`;

export const MetricAttr = styled.div`
  ${skeleton};
  width: 70%;
  height: 8px;
  border-radius: 4px;
`;

export const DescPlaceholder = styled.div`
  ${skeleton};
  width: 100%;
  height: 8px;
  border-radius: 4px;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
`;

export const ActivityPlaceholder = styled.div`
  ${skeleton};
  width: 32px;
  height: 32px;
  border-radius: 6px;
`;

export const ButtonPlaceholder = styled.div`
  ${skeleton};
  width: 95%;
  height: 48px;
  border-radius: 10px;
  margin-top: auto;
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


export const InfoContainer = styled.div` 
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    height: auto;
    gap: 5%;
`;


export const Activities = styled.div`
    display: flex;
    width: 100%;
    margin:5px 0 15px 0;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
`;