import styled, { keyframes, css } from "styled-components";


export const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    background-color: #F4F4F5;
    overflow: auto;
`;


export const WebFormContainer = styled.div`
    display: flex;
    position:relative;
    flex-direction: column;
    width: 100%;
    max-width:858px;
    text-align: left;
    justify-content: flex-start;
    padding: 45px 41px 45px 41px;
    gap:40px;
    background-color: white;
`;  


//Header------------------------------------------------------
export const Header = styled.div`   
   display: flex;
   flex-direction :row;
`;

export const HeaderTextSection = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 55%;
    gap: 8px;

`

export const HeaderLogoSection = styled.div`
    display: flex;
    flex-grow:1;
    justify-content: flex-end;
    align-items: flex-start;
`

export const LogoImg = styled.img`
    width: 120px;
    height: auto;
    margin-right: 20px;
`;

export const Title = styled.p`
    font-weight: 600;
    font-size: 30px;
    line-height: 100%;
    letter-spacing: 0px;
    vertical-align: middle;
    margin:0;
    padding:0;

`;

export const SubTitle = styled.p`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.24px;
    vertical-align: middle;
    color:#646262;
    margin:0;
    padding:0;
`;

export const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #C6C6C6;
`;

//Templates Upload Status------------------------------------------------------
export const TemplatesUploadStatus = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 2%;
    padding:0;
    margin:-20px 0;
`;


export const TemplateUploadSquare = styled.div<{ $status: string}>`
   display:flex;
   width:20%;
   justify-content:center;
   align-items:center;
   height: auto;
   color:  ${(props) =>
        props.$status === "confirmed"
            ? "rgb(255, 255, 255)"
            : props.$status === "Selected"
            ? "rgb(255, 255, 255)"
            : "rgb(0, 0, 0)"};
   text-align: center;
   border: ${(props) =>
        props.$status === "confirmed"
            ? "none"
            : props.$status === "Selected"
            ? "none"
            : "1px solid rgb(185, 185, 185)"
        };

   background-color: ${(props) =>
        props.$status === "confirmed"
            ? "#4C8C2B"
            : props.$status === "Selected"
            ? "rgb(143, 142, 142)"
            : "rgb(255, 255, 255)"
        };
   border-radius: 8px;
   transition: 0.3s;
   transform: ${(props) => 
            props.$status === "confirmed" 
                ? "scale(1)" 
                :  props.$status === "Selected" 
                ? "scale(1.070)" 
                : "scale(1)"
         };
   cursor:pointer;

    &:hover {
         transform: scale(1.015);
    }
   `; 


export const TemplatesUploadText = styled.p`
    font-weight: 550;
    font-size: 18px;
    vertical-align: middle;

    @media (max-width: 765px) {
        font-size: 12px;
    }
`;



//Form------------------------------------------------------

export const Asterisk = styled.p<{ $mandatory?: boolean }>`
    width: 10px;
    height: 15px;
    color: #4C8C2B;
    font-size: 15px;
    opacity: ${(props) => (props.$mandatory ? 1 : 0)};

`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
`;

export const RowWrapper = styled.div<{ $isExpanded: boolean }>`
    display: flex;
    width: 100%;
    height: ${(props) => (props.$isExpanded ? "auto" : "60px")};
    max-height: ${(props) => (props.$isExpanded ? "auto" : "60px")};
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 15px;
    padding: 0;
    margin: 0;
    border-radius: 8px;
    background-color: transparent;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
    overflow: hidden;
`;


export const UploadRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    margin-top: 20px;
`;

export const UploadContent = styled.div`
    position: relative; 
    display: flex;
    width: 100%;
    align-items: center; 
`;
    

export const FormSection = styled.form<{ $templateSelected?: boolean }>`
    display: ${(props) => (props.$templateSelected ? "flex" : "none")};
    width: 100%;
    justify-content: flex-start;
    flex-direction: column;
    gap: 20px;
    font-weight: 550;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: -0.24px;
    vertical-align: middle;
    margin:0;
    padding:0;
    color:#1B1A1A;
`;



export const FieldSelect = styled.select`
  -webkit-appearance: none; 
  -moz-appearance: none;   
  appearance: none;

  &::-ms-expand {
    display: none;
  }

  width: 100%;
  height: 40px;
  border: 1px solid #C6C6C6;
  border-radius: 8px;
  padding: 0px 16px !important;
  padding-right: 40px;
  font-size: 15px;
  font-weight: 550;
  color: #131313;
  background-color: white;
  background: url("/img/vector/LeftSidebar/expand.svg") no-repeat right 10px center;
  background-size: 22px;
  cursor: pointer;

  option {
     width: auto;
     padding: 10px 0 !important;
     font-size: 15px;
     font-weight: 550;
     background-color: white;
     color: #131313;
     cursor: pointer;
    }
`;


export const FieldName = styled.p`
    width:50%;
    font-weight: 550;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: -0.24px;
    vertical-align: middle;
    margin:0;
    padding:0;
    color:#1B1A1A;
`;

export const FieldInput = styled.input<{$isDisabled: boolean}>`
    width: 100%;
    height: 40px;
    border: 1px solid #C6C6C6;
    border-radius: 4px;
    padding: 0 16px;
    font-size: 16px;
    color: #333;
    box-sizing: border-box; 
    
    &[type="file"] {
        width: auto;
        border-radius: 8px;
        max-width: 100px;
        padding:0;
        height: 100%;
        opacity: 1;
        cursor: pointer;
        border: none;
        color:transparent;
        
    }

    &::file-selector-button {
        background-color: ${(props) => (props.$isDisabled ? "#C6C6C6" : "#4C8C2B")};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
        font-size: 15px; 
    }
`;

export const UploadInput = styled.input<{$file: boolean}>`
    width: 100%;
    height: 40px;
    border: 1px solid #C6C6C6;
    border-radius: 4px;
    padding: 0 16px;
    font-size: 16px;
    color: #333;
    box-sizing: border-box; 
    
    &[type="file"] {
        width: auto;
        border-radius: 8px;
        max-width: 100px;
        padding:0;
        height: 100%;
        opacity: 1;
        cursor: pointer;
        border: none;
        color:transparent;
        
    }

    &::file-selector-button {
        background-color: ${(props) => (props.$file ? "#C6C6C6" : "#4C8C2B")};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        cursor: ${(props) => (props.$file ? "not-allowed" : "pointer")};
        font-size: 15px; 
    }
`;

export const FileNameDisplay = styled.span`
    display: flex;
    padding-left: 10px;
    font-size: 15px;
    color: #333;
    align-items: left;
    justify-content: flex-start;
    vertical-align: middle;
`;




//Upload Options - Radio Buttons--------------------------------------------

export const RadioGroup = styled.div`
    display:flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    padding: 25px 0; 
`;

export const RadioRow = styled.label`
    display:flex;
    flex-direction: row;
    align-items: flex-start;
    cursor: pointer;
`;

export const RadioContent = styled.div`
   display:flex;
   flex-direction: column;
`;

export const RadioWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

export const RadioLabel = styled.label`
    font-weight: 550;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0%;
    padding: 0;
    margin: 0;
    margin-left: 10px;
    color: #1B1A1A;

      
    &[type="input"] {
    -webkit-appearance: none; 
    -moz-appearance: none;   
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #4C8C2B;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    margin: 0;

    &:checked::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #4C8C2B;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
        
    }

    
`;

export const RadioDescription = styled.span`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0%;
    padding: 0;
    margin: 0;
    margin-left: 10px;
    color: #7C7C7C;
`;


export const DeleteIcon = styled.img<{$file:boolean}>`
    display: ${(props) => (props.$file ? "block" : "none")};
    width: auto;
    height: 23px;
    margin-left: 1% !important;
    margin: 0;
    cursor: pointer;
`;



//ALERT MODALS ------------------------------------------------------

// export const AlertModalContainer = styled.div<{$message: boolean}>`
//     display: ${(props) => (props.$message ? "flex" : "none")};
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     background-color: rgb(145, 56, 56);
//     z-index: 1000;
// `;


export const AlertContent = styled.div<{ $type?: string, $message: boolean }>`
    display: ${(props) => (props.$message ? "flex" : "none")};
    position: relative;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: auto;
    width: 100%;
    border-radius: 10px;
    padding: 15px 15px;
    color: white;
    background-color: ${({ $type }) => {
        switch ($type) {
            case "success":
                return "#04AA6D";
            case "confirmed":
                return "#04AA6D"; 
            case "not_sumbitted":
                return "#04AA6D";       
            case "info":
                return "#2196F3";
            case "warning":
                return "#ff9800";
            default:
                return "rgb(236, 86, 86)";
        }
    }};
    animation: slideDown 0.4s ease forwards;

    @keyframes slideDown {
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

export const AlertText = styled.p`
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    padding: 0;

    @media (max-width: 765px) {
        font-size: 120;
    };
`;

export const AlertCloseButton = styled.span`
    color: white;
    font-weight: bold;
    float: right;
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        transform: scale(1.4);
    }
`;


export const ValidationSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    width: 100%;
    border-radius: 8px;
`;


export const ValidationText = styled.p`
    font-weight: 550;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: -0.24px;
    vertical-align: middle;

`;

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(359deg);
    }
`;

export const ValidationIcon = styled.img<{ $isValidating?: boolean }>`
    width: 22px;
    height: 22px;
    margin-left: 10px;

${(props) =>
        props.$isValidating &&
        css`
            animation: ${rotate} 1s linear infinite;
        `}
`;

export const SubmitSection = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap:20px;
`;

export const CancelDataset = styled.button<{ $isDisabled: boolean }>`
    width: 174px;
    height: 44px;
    padding-top: 13px;
    padding-right: 32px;
    padding-bottom: 13px;
    padding-left: 32px;
    gap: 8px;
    border-radius: 10px;
    border-width: 1px;
    background:rgb(255, 255, 255);
    border: 1px solid #C6C6C6;
    color: black;
    cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
`;

export const SubmitDataset = styled.button<{ $isDisabled: boolean }>`
    width: 174px;
    height: 44px;
    padding: 13px 32px;
    gap: 8px;
    border-radius: 10px;
    border: none;
    outline: none;
    color: white;
    background: ${(props) => (props.$isDisabled ? "#C6C6C6" : "#4C8C2B")};
    cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
    text-decoration: none;

    &:focus {
      outline: none;
      box-shadow: none;
    }
`;




//MODAL------------------------------------------------------

export const UploadModalContainer = styled.div<{$isOpen: boolean}>`
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 2;
   
`


export const UploadModal = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 80%;
    max-width: 480px;
    padding: 25px;
    border-radius: 10px;
    gap: 20px;
    overflow: auto;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 3;
`;


export const UploadModalHeader = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap:20px;
`;


export const UploadModalFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap:20px;
    ;`

export const UploadButton = styled.button<{$file: boolean}>`
    border-radius: 10px;
    border-width: 1px;
    padding: 13px 20px;
    text-align: center;
    color: #fff;
    transition: 0.3s;
    font-size: 14px;
    font-weight: 550;
    border: none;
    outline: none;
    color: white;
    text-decoration: none;
    background-color: ${(props) => (props.$file ? "#C6C6C6" : "#4C8C2B")};
    cursor: ${(props) => (props.$file ? "not-allowed" : "pointer")};

    @media (max-width: 1024px) {
        font-size: 1rem;
    }
    @media (max-width: 765px) {
        font-size: 0.95rem;
    }
    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;


export const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin:0;
  padding:0;
  user-select: none;
`;

export const ModalText = styled.p`
  font-size: 16px;
  color: #555;
  user-select: none;
  margin:0;
  padding:0;
`;


export const CloseModal = styled.button`
        background-color: #C6C6C6; 
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        cursor:  pointer;
        font-size: 15px; 
        transition: 0.3s;

  &:hover {
    background-color:rgb(170, 170, 170);
  };`



export const IconsContainer = styled.div`
   display: flex;
   flex: 1;
   flex-direction: row;
   justify-content: space-between;
   /* background-color: antiquewhite; */
   padding:20px;
`;


export const FormatWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;


  export const FormatIcon = styled.img<{ $isSelected: boolean, $isDisabled: boolean }>`
    width:85px;
    height:85px;
    gap: 10px;
    opacity: ${(props) => (props.$isSelected ? 1 : 0.5)};
    cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
    transition: 0.3s;
  `;


export const FormatText = styled.p<{ $isDisabled: boolean }>`
    font-weight: 550;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0%;
    padding: 0;
    margin: 0;
    color: #1B1A1A;
    user-select: none;
    opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
`;


export const CloseIcon = styled.img`
    position: absolute;
    top: 5px;
    right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

export const  TooltipContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
`;

export const InfoIcon = styled.img`
    width: 15px;
    height: 15px;
    margin-left: 5px;
    cursor: pointer;
`;

export const Tooltip = styled.div<{$top: number; $left: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  max-width: 220px;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px 8px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-size: 13px;
  color: #333;
  white-space: normal;
  pointer-events: none;
  word-wrap: break-word;
`;






