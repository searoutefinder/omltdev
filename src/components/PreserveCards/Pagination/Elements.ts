import styled from "styled-components";

export const PaginationContainer = styled.div`
   display:flex;
   position: relative;
   margin-top: 25px;
   flex-shrink: 1;
   justify-content: center;
   gap:15px;
   `


export const NavigationButton = styled.button`
    padding: 8px 16px;
    font-size: 16px;
    border: 1px solid #ccc;
    background-color: #4C8C2B;`


export const PageButton = styled.button<{ 
    $isActive: boolean 
    $disabled: boolean
    }>`
    width: 50px;
    height: 50px;
    font-size: 18px;
    font-weight: 500;
    border: ${(props) => (props.$isActive ? "none" : "1px solid #ccc")};
    border-radius: 50%;
    background-color: ${(props) => (props.$isActive ? "#4C8C2B" : "white")};
    color: ${(props) => (props.$isActive ? "white" : "black")};
    cursor: ${(props) => (props.$isActive ? "default" : "pointer")};
    pointer-events: ${(props) => (props.$disabled ? "none" : "auto")};
    transition: all 0.3s ease;

    &:hover {
        background-color: ${(props) => (props.$isActive ? "#4C8C2B" : "#f0f0f0")};
        color: ${(props) => (props.$isActive ? "white" : "#4C8C2B")};
    }
    `




