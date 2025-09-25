import styled from 'styled-components';


//ITEM -------------------------------------------------
export const ContentItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
  touch-action: none;  //blocks iOS page-scroll on dragging */
  pointer-events: auto;
`

export const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  flex-grow: 1;
  min-width: 95%;
  justify-content: center;
  align-items: flex-start;
  background-color: "white";
  padding: 20px 15px;
  overflow: hidden !important;
`


export const ResultsTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  text-decoration: none;
  margin-left:7px;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
  text-transform: capitalize;
  `;


export const InfoIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
  opacity: 1;
`;



//HEADER -------------------------------------------------
export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 12px;
  border-bottom: 1px solid #C6C6C6;
`;


export const HeaderContainer = styled.div`  
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap:15px;
  padding: 10px 0 10px 0;
`


export const ContentItemHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap:4px;
  padding: 5px 0 0 0;
  border-bottom: 1px solid #0000001F;
`


// HEADER ICONS
export const ContentItemTitle = styled.div`
  display:flex;
  font-size: 18px;
  font-weight: 700; 
  padding-bottom: 16px;
  color: #000000;;
  text-align: left;
  text-decoration: none;
`


//CONTENT WRAPPER -------------------------------------------------
export const ScrollWrapper = styled.div<{$isOpen: boolean}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '45vh' : 'none')};
  transition: max-height 0.3s;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  overscroll-behavior: contain;
  ` 
  
export const ContentItemBody = styled.div<{$isOpen: boolean}>`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 9px;
  border-top: 1px solid #e6e5e5;
  padding: 18px 0;
`


export const ContentItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap:12px 0;
  padding: 12px 0;
`


export const ContentItemSubtitle = styled.div`
  display: flex;
  position: relative;
  font-size: 15px;
  font-weight: 600;
  color:#000000;
;

  text-decoration: none;
`
export const ContentItemDescription = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  color: #646262;
  letter-spacing: -0.2px;
  text-decoration: none;
  line-height: 1.2;
`;



export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  gap:10px;
  align-items: flex-start; 
  padding: 5px;
  /* background-color: red;  */
`;


export const FirstPartWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  gap: 2px;
  
  /* background-color: blue;  */
`;


export const SecondPartWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: fit-content;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
  /* background-color: green;  */
`;

export const FooterIcon = styled.img`
  position: relative;
  width: 24px;
  height: 24px;
  opacity: 0.9;
`;


export const FooterText = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color:  #4C8C2B;;
  font-weight: 500;
  padding:0; 

`;


export const TypeOfOrganization = styled.div`
  display: flex;
  position: relative;
  max-width: 45%;
  font-size: 12px;
  border: 1px solid #F7D1A4;
  background-color: #FCEDD8;
  padding: 5px 10px;
  border-radius:5px;
  /* color: #812510; */
;`



export const Value = styled.div`
  display: flex;
  flex-grow: 1;
  color: #6F6F6F;
  font-size: 15px;
  font-weight: 500;
  /* text-decoration: underline;  */
`


export const CloseLeftPanel = styled.img`
  position:absolute;
  right:0;
  width: 17px;
  height: 17px;
  margin-right: 20px;
  cursor: pointer;
  opacity: 0.55;

  &:hover {
    opacity: 1;
  }

  //hide on small layout
  @media (max-width: 328px) {
    display: none;
  }

`;


//Modal Wrapper ----------------------------------------------------------------------------------
export const FiltersRow = styled.div`
  display: flex;
  width: 98%;
  justify-content: flex-start;
  align-items: center;
  gap: 5%;
  padding: 5px 5px 15px 5px;
`;


  export const FilterIcon = styled.img`
  width: 15px;
  height: 18px;
  margin-left: 2px;
  pointer-events: none;
  opacity: 1;
  cursor: none;
  `


export const FiltersButton = styled.button`
  /* layout */
  display: flex;
  align-items: center;
  gap: 6px;               

  /* shape */
  padding: 6px 10px;     
  border: 1px solid #757575;     
  border-radius: 10px;   

  background: #fafafa;           
  box-shadow: 0 0 0 2px #ffffff inset;

  /* text */
  font-size: 14px;
  font-weight: 600;
  color: #1e1e1e;
  cursor: pointer;
  transition: 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: #f0f0f0;
    border: 1px solid #686868;
  }

  &:active {
    background: #e8e8e8;
    box-shadow: 0 0 0 2px #d8d8d8 inset;
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px #ffffff inset, 
      0 0 0 3px rgb(214, 167, 155);        
  }

  user-select: none;
`;


export const FiltersCount = styled.span<{
  $isHidden: boolean;
}>`
  display: ${(props) => (props.$isHidden ? "none" : "inline-block")};
  height: 100%;
  background-color: #FCEDD8;
  color: #A7634E;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  padding: 1px 5px;
  border-radius: 5px;
  border: 1px solid #F7D1A4;
  `


export const ClearFiltersButton = styled.div<{
  $isHidden: boolean;
  $isLoading: boolean | undefined;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  background-color:rgb(236, 236, 236);
  font-size: 12px;
  color:rgb(71, 71, 71);
  margin-right: 10px;
  border-radius: 10px;
  padding: 5px 7px;
  cursor: pointer;
  border: 1px solid #c6c6c6; 
  opacity: ${(props) => (props.$isHidden || props.$isLoading ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$isHidden || props.$isLoading ? "none" : "auto")};
  transition: background-color 0.2s ease, opacity 0.2s ease;
  
  
  &:not(:hover) {
    background-color: rgb(236, 236, 236);
  }

  &:hover {
    background-color: rgb(220, 220, 220);
  }

  &:active {
    background-color: rgb(210, 210, 210);
  }



  &:hover {
  }
  
  `
