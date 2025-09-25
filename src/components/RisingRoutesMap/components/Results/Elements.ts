import styled from 'styled-components';


//resultsContainer
//resultItem 
//locationPointer
//resultsTextWrapper
//resultstext
//resultDescription


export const ResultsContainer = styled.div<{ 
  $isHidden: boolean;
  $isOpen: boolean; 
  $isLarger: boolean;
}>`
  display: ${(props) => (props.$isHidden ? "none" : "flex")};
  position:${(props) => (props.$isHidden ? "absolute" : "relative")};
  top:${(props) => (props.$isHidden ? "0" : "auto")};
  width: 95%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: ${(props) => ((props.$isOpen && props.$isLarger) ? "250px" : "95px")};
  
  //padding, margin 
  padding: 8px;
  margin-top: 2px;
  border-radius: 0 0 12px 12px;
  gap: 4px;

  //pointer events, scroll and background
  pointer-events: auto;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
  box-shadow: 0px 12px 32px 0px #00000033, 0px 2px 8px 0px #0000001A;
  z-index: 100;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s;
  opacity: ${(props) => (props.$isHidden ? 0 : 1)};
`




export const ResultItem = styled.div<{ $selected: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  padding: 20px 5px;
  border-bottom: 1px solid #C6C6C6;
  gap: 12px;
  background-color: ${(props) => (props.$selected ? "#dadada" : "white")};
  cursor: pointer;
  
  //mobile view
  @media (max-width: 600px) {
    padding: 10px 5px;
    gap: 12px;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`


export const ResultsTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap:10px;

  //mobile view
  @media (max-width: 600px) {
    gap: 3px
  }
`


export const ResultText = styled.span`
  font-size: 16px;
  color: #333;
  margin:auto;
  margin-left: 0px;
  align-items: flex-start;
  text-align: left;
  padding: 0px 1px;
`


export const  LocationPointer = styled.img`
  width: 15px;
  height: 19px;
  opacity: 1;
`

export const ResultDescription = styled.span` 
  font-size: 12px;
  color: #7C7C7C;
  ;
`

