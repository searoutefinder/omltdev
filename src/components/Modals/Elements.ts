import styled, { keyframes } from "styled-components";

interface ContainerProps {
    $showModal: boolean;
}

const slideDown = keyframes`
    from {
        transform: translateY(-100%);
    }
    to {
        transform: translateY(0);
    }
`;

export const Container = styled.div<ContainerProps>`
    display: ${({ $showModal }) => ($showModal ? 'flex' : 'none')};
    position: absolute;
    height: 100%;
    width: 100%;
    margin: auto;
    padding: 0;
    flex-direction: column;
    background-color: white;
    align-items: center;
    justify-content: flex-start;
    z-index: 100;
    animation: ${({ $showModal }) => ($showModal ? slideDown : 'none')} 0.5s ease-out;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 40px 20px;
`;


export const Title = styled.h1`
font-size: 1.5rem;
color: #333;
margin-bottom: 20px;
`;

export const CloseButton = styled.button`
background-color: #4c8c2b;
color: white;
border: none;
padding: 10px 20px;
border-radius: 5px;
cursor: pointer;
margin-bottom: 20px;
font-size: 1rem;

&:hover {
    background-color: #3a6e22;
}
`;

export const Instructions = styled.p`
font-size: 1rem;
color: #666;
margin-bottom: 20px;
text-align: center;
`;

export const StepsList = styled.ol`
font-size: 1rem;
color: #666;
margin-bottom: 20px;
padding-left: 20px;
`;

export const Step = styled.li`
margin-bottom: 10px;
`;
