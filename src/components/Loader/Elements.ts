import styled, { keyframes } from "styled-components";


export const LoaderWraper = styled.div<{
  $styleLoaded?: boolean,
  $layersLoaded?: boolean,
  $dataLoaded?: boolean,
  $isFetching?: boolean,
  $isMobile?: boolean
  $risingRoutes?: boolean,
  $leftPanelOpen?: boolean
}>`

    display: ${props => (
      props.$styleLoaded 
      && props.$layersLoaded 
      && props.$dataLoaded 
      && !props.$isFetching) ? 'none' : 'flex'};
    position: absolute;
    flex-direction: column;
    height:100%;
    width:100%;
    margin-left: ${props => (
      props.$isMobile
        ? '0%'
        : (props.$risingRoutes 
          && props.$leftPanelOpen ? '9%' : '0')
    )};  
    opacity:80%;
    justify-content: center;
    align-items: center;
    gap:2px;
    z-index: 100;
    pointer-events: none !important;
`


export const LoaderText = styled.p`
    font-size: 1.5rem;
    color: #353535;
    font-weight: 600;
    text-align: center;
    margin-left:1.0rem;
    `


const shimmer = keyframes`
0% {
  background-position: -200% 0;
}
100% {
  background-position: 200% 0;
}
`;

export const SkeletonContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #ffffff 25%,
    #f2f2f2 37%,
    #ffffff 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  z-index: 999;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const SpinnerWrapper = styled.div`
  width: 45px;
  height: 45px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 2px rgba(0,0,0,0.10), 
              0 0 4px 0 rgba(0,0,0,0.15);
`;


export const SpinnerIcon = styled.div`
  width: 32px;
  height: 32px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v4l4-4-4-4v4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.87 0 7.06-2.76 7.82-6.41h-2.06c-.7 2.55-3.04 4.41-5.76 4.41-3.31 0-6-2.69-6-6s2.69-6 6-6z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  animation: ${rotate} 1s linear infinite;
`;
