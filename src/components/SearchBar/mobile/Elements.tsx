import styled from "styled-components";


export const LeftSidebar = styled.div`
  position: absolute;
  display: flex;
  top: 60px;
  left: 0;
  width: 426px;
  max-width: 450px;
  height: auto;
  max-height: 92%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 2px;
  background-color: transparent;
  z-index: 5;
  overflow: hidden;
  

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    height: auto;
    top: 0;
    left: 0;
  };
`

export const LeftPanelWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`


//filter bar ---------------------------------------------------------------------------------------
export const FilterBarContainer = styled.div`
   position: absolute;
   display: flex;
   top: 75px;
   right: 8px;
   z-index: 3;
   padding: 5px 7px;
   background-color: #ffffff;
   border-radius: 10px;
   border: 1px solid #919090a4;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
   cursor: pointer;
`

export const FilterIcon = styled.img`
  width: 15px;
  height: 18px;
  margin-left: 2px;
  pointer-events: none;
  opacity: 0.85;
  cursor: none;
  z-index: 1;
  `



// START---------------------------------------------------------------------------------------
export const SearchBarContainer = styled.div<{
  $active: boolean;
}>`
  position: absolute;
  top: 5px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 98%; 
  border-radius: ${(props) => (props.$active ? "20px" : "10px")};
  border: ${(props) => (props.$active ? "1px solid #bebebe" : "1px solid #C6C6C6")};
  box-shadow: ${(props) => (props.$active ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.2)")};
  background-color: #ffffff; 
  overflow: hidden;
  z-index: 10;
  transition: 
    border-radius 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    border 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
`

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #0056b3;
  }
`

export const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 12px;
  margin-right: 8px;
  pointer-events: none;
  opacity: 1;
  cursor: none;
`;



export const ClearInputButton = styled.div<{
  $isHidden: boolean;
  $isFetching: boolean | undefined;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  background-color: #e0e0e0;
  font-size: 14px;
  color: #868585;
  margin-right: 10px;
  border-radius: 50px;
  padding: 5px 10px;
  cursor: ${(props) => (props.$isHidden || props.$isFetching ? "not-allowed" : "pointer")};
  pointer-events: ${(props) => (props.$isHidden || props.$isFetching ? "none" : "auto")};
  opacity: ${(props) => (props.$isHidden || props.$isFetching ? 0.5 : 1)};

  &:hover {
  background-color: #cacaca;
  }
`;


export const InputContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  padding: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  `

export const Input = styled.input`
  width: 100%;
  padding: 10px 5px;
  text-decoration: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.value ? "#000" : "#7C7C7C")}; 

  &:focus {
    outline: none;
    border-color: #e7e7e7b9;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:disabled:hover {
  }

  &:disabled:focus {
    border-color: #ccc;
  }
`;


// //Toggle button for left panel ----------------------------------------------------------------------------------
// export const ToggleButton = styled.div`
//     position: absolute;
//     display: flex;
//     width: 20px;
//     height: 20px;
//     top: 45%;
//     right: -20.5px;
//     //align ---
//     justify-content: center;
//     align-items: center;
//     //decorations
//     border-radius: 0 8px 8px 0;
//     padding:20px 6px;
//     background-color: white;
//     user-select: none !important;
//     cursor: pointer;
//     z-index: 10;
//     border-right: 1px solid #C6C6C6;
//     //shadows
//     box-shadow: 6px 0px 9px 0px rgba(116, 116, 116, 0.25);
//     background-color: #e2e2e2;
//     @media (max-width: 768px) {
//       padding:35px 5px;
//       right: -30.5px;
//     }

//     @media (max-width: 350px) {
//       padding:28px 3px;
//       right: -24px;
//     }

// &:hover {
//     /* color: #6d6d6d; */

//     img {
//       transform: scale(1.3); 
//       transition: transform 0.25s; 
//     }
//   }`

// export const ToggleIcon = styled.img`
//   height: 14px;
//   width: 8.41px;
//   transition: 'transform 0.2s';
//  `
