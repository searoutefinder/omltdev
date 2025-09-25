import React from 'react';
import 'loaders.css';
import { LoaderWraper, LoaderText } from './Elements';
import Loader from 'react-loaders';

interface LoaderProps {
  risingRoutes?: boolean;
  isMobile?: boolean;
  styleLoaded?: boolean;
  dataLoaded?: boolean;
  layersLoaded?: boolean;
  isFetching?: boolean;
};

const LoaderEl = ({ risingRoutes, isMobile, styleLoaded = false, isFetching = false }: LoaderProps) => {
  
  return (
    <LoaderWraper $styleLoaded={styleLoaded}
                  $layersLoaded={true} 
                  $dataLoaded={true} 
                  $isFetching={isFetching}>
    
      <Loader
        type={risingRoutes ? "line-spin-fade-loader" :  "ball-spin-fade-loader"}
        active
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        color= {risingRoutes ? "#353535" : "#CDDDFF"}
        style={{ 
           transform: isMobile ? 'scale(0.8)' : 'scale(1.25)',
           
            
         }}
      />
      {risingRoutes && <LoaderText>Loading...</LoaderText>}
    </LoaderWraper>
  );
};

export default LoaderEl;
