import React from 'react';
import 'loaders.css';
import { LoaderWraper,SpinnerWrapper, SpinnerIcon  } from './Elements';

interface LoaderProps {
  risingRoutes?: boolean;
  isMobile?: boolean;
  styleLoaded?: boolean;
  dataLoaded?: boolean;
  layersLoaded?: boolean;
  isFetching?: boolean;
  leftPanelOpen?: boolean;
};

const LoadingSpinner = ({ 
  risingRoutes,
  styleLoaded = false,
  isMobile, 
  isFetching = false,
  leftPanelOpen }: LoaderProps) => {
  
  return (
    <LoaderWraper $styleLoaded={styleLoaded}
                  $layersLoaded={true} 
                  $dataLoaded={true} 
                  $isFetching={isFetching}
                  $isMobile={isMobile}
                  $risingRoutes={ risingRoutes}
                  $leftPanelOpen={leftPanelOpen}  
>                
    <SpinnerWrapper>
      <SpinnerIcon />
    </SpinnerWrapper>
    </LoaderWraper>
  );
};

export default LoadingSpinner;
