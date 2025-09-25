import styled from "styled-components";

export const LoaderWraper = styled.div<{ $isFetching?: boolean }>`
    display: ${(props) => (props.$isFetching ? "flex" : "none")};
    position: absolute;
    height: 100%;
    width: 100%;
    margin-left: 6%;
    opacity: 80%;
    justify-content: center;
    align-items: center;
    z-index: 5;
    pointer-events: ${(props) => (props.$isFetching ? "none": "auto")};
    background-color: rgba(110, 110, 110, 0.5);
    backdrop-filter: blur(0.5);
    user-select: none;
`;
