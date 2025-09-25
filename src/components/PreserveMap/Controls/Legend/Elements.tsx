import styled from 'styled-components'


export const ControlsContainer = styled.div`
  display:flex;
  position: absolute;
  bottom: 10px;
  right: 5px;
  flex-direction: row;
  justify-content: center;
  height: auto;
  width: auto;
  align-items: flex-end;
  padding: 5px;
  z-index: 1;
  gap:10px;

  @media (max-width: 350px) {
    bottom:5px;
  }
`


export const IconsWrapper = styled.div<{$showStyles: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  max-height: ${({ $showStyles }) => ($showStyles ? '200px' : '100px')};
  transition: max-height 0.1s ease-in-out;
`;


export const BasemapsContainer = styled.div<{$isMobile:boolean, $showStyles:boolean}>`
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  padding: 4px;
  border-radius: ${props => (props.$isMobile && props.$showStyles) ? '15px' : '25%'};
  border: 2px solid #c4c4c4ce;
  box-shadow: -1px 1px 20px 2px rgba(114, 114, 114, 0.11);
  transition: border-radius 0.1s ease-in-out;

  @media (min-width: 756px) {
    &&:hover { 
      border-radius: 15px;
    }
  }

  @media (max-width: 350px) {
    padding: 2px;
  }
`;


export const LegendIconContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column !important;
  height: auto; 
  justify-content: flex-end;
  align-items: center;
  box-shadow: -1px 1px 20px 2px rgba(114, 114, 114, 0.11);
  transition: all 0.1s ease-in-out;
  background-color: #fff;
  padding:4px;
  border-radius: 25%;
  border: 2px solid #c4c4c4ce;


  &&:hover {
    background-color: #f1f1f1;
    transition: all .1s ease;
  }

  @media (max-width: 350px) {
    padding: 2px;
    border: 2px solid #c4c4c4ce;
  }

`;


export const BasemapIconsWrapper = styled.div<{ $showStyles:boolean }>`
  display: ${props => props.$showStyles ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding:0;
  margin:0;
  gap:5px;
  opacity: ${props => props.$showStyles ? 1 : 0};
  transition: opacity 0.5s ease-in-out;

  @media (max-width: 350px) {
    padding:2px;
  }
`


//icons
interface MultiLayerIconProps { 
  $showStyles:boolean;
}

export const MultiLayerIcon = styled.div<MultiLayerIconProps>`
  display: ${props => props.$showStyles ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  height: auto;
  padding: 0px;
  border-radius: 25%; 
  margin:0;
  cursor: pointer; 

  @media (max-width: 350px) {
    width: 18px;
    height: 18px;
  }
`;


interface BasemapIconsProps {
  $disabled:boolean;
  $selected:boolean;
}

export const BasemapIcon = styled.div<BasemapIconsProps>`
  display:flex;
  position: relative;
  width: 25px;
  height: auto;
  padding: 0px;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.$disabled ? 'default' : 'pointer' };;
  border-radius: 25%;
  border: ${props => props.$selected ? "2.5px solid #15a5e5" : "none"};
  opacity: ${props => props.$disabled ? 0.85 : 1 };

  @media (max-width: 350px) {
    width: 18px;
    height: 18px;
    border-radius: 25%;
    border: ${props => props.$selected ? "2px solid #15a5e5" : "none"};
  }
`;


export const LegendIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  height: auto;
  padding: 0px;
  border-radius: 50%; 
  margin:0;
  cursor: pointer; 

  @media (max-width: 350px) {
    width: 18px;
    height: 18px;
  }
`;


export const MultiLayerPng = styled.img`
  width: 20px;
  height: 20px;

  @media (max-width: 350px) {
    width: 18px;
    height: 18px;
  }
`

export const BasemapPng = styled.img<{ $showStyles: boolean }>`
  width: 25px;
  height: 25px;

  @media (max-width: 350px) {
    width: 19px;
    height: 19px;
  }
`;


//Legend
export const LegendContainer = styled.div<{ $showLegend:boolean }>`
  display: ${props => props.$showLegend ? 'flex' : 'none'}; 
  height: auto;
  min-width: 120px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  overflow-x:hidden;
  border: 1px solid #E5E5E5;
  box-shadow: -1px 1px 20px 2px rgba(65, 65, 65, 0.11);
  

  @media (max-width: 350px) {
    min-width: fit-content;
    padding: 5px 10px;
  }
`

export const LegendHeader = styled.div`
  display: flex;
  width:100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 5px 10px 5px;
  gap:15px;
  border-bottom: 1px solid #E5E5E5;
  
  @media (max-width: 350px) {
    gap:10px;
  }
`

export const LegendTitle = styled.p`
  font-size: 15px;
  font-weight: 550;
  padding:0;
  margin:0;
  color:#4b4b4b;
 
 @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (max-width: 425px) { 
   font-size: 14px; 
  }

  @media(max-width: 350px) {
    font-size: 12px;  
  }
`

interface CloseIconProps {
  $strokeColor: string;
}

export const CloseIcon = styled.img<CloseIconProps>`
  position:relative;
  width: 10px;
  height: 10px;
  margin:auto;
  cursor: pointer;
  right:-3px !important;
  top:-1px !important;`;


export const LegendContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 5px;
  gap: 5px;
  overflow:auto;
  max-height: 250px;
  overflow-y:auto;

  @media (max-width: 350px) {
    gap:3px;
  }
`

export const LegendRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0;
  margin:0;
  gap: 18px;

  @media (max-width: 350px) {
    gap:10px;
  }
`


export const Symbol = styled.img`
  width: 20px;
  height: 20px; 
  
  @media(max-width: 350px) {
    width: 15px;
    height:15px;  
  }
`

export const Title = styled.p`
  font-size: 14px;
  font-weight: 500;
  padding:0;
  margin:0;
  color:#4b4b4b;
   
   
 @media (max-width: 768px) {
    font-size: 13px;
  }
  @media (max-width: 425px) { 
   font-size: 13px; 
  }

  @media(max-width: 350px) {
    font-size: 11px;  
  }
`


export const Tooltip = styled.div<{ $showTooltip:boolean}>`
  display: flex;
  position: absolute;
  padding:8px;
  right: 35px;
  top:1px;
  color:#4b4b4b;
  background-color: #fff; 
  border-radius: 5px;
  font-size: 12px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  transform: scale(${props => (props.$showTooltip) ? 1 : 0.0});
  transition: transform 0.1s ease-in-out;
`

