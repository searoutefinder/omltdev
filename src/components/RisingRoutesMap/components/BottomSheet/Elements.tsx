import styled from "styled-components";

//mobile layout 
export const BottomSheetContainer = styled.div<{ 
  $open: boolean
  $isSelected: boolean;
  }>`
  position: ${p => (p.$isSelected ? 'absolute' : 'relative')};
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height:auto;
  max-height: 65%; //breakpoint for mobile(65vh - iframe root)
  min-height: 50px;
  background: #fff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.18);
  transition: transform .25s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${p =>
  p.$open
     ? 'translateY(0%)'
     : 'translateY(calc(100% - var(--peek, 75px)))'};
  
  will-change: transform;
  -webkit-overflow-scrolling: auto;
  touch-action: none;    //blocks iOS page-scroll on dragging */
 
  

  @media (min-width: 769px) {
    display: none;
  }
`;


export const BottomSheetHandle = styled.div`
  width: 60px;
  height: 6px;
  background:  #E2E2E2;
  border-radius: 3px;
  margin: 15px auto 0px auto;
  cursor: grab;
`;

export const BottomSheetContent = styled.div`
  padding: 2px 5px 5px 5px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;


export const BottomSheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

