import React from 'react';
import 'loaders.css';
import { LoaderWraper } from './Elements';
import Loader from 'react-loaders';

interface LoaderProps {
  isFetching?: boolean; 
};

export const LoaderEl = ({isFetching}: LoaderProps) => {
  
  return (
    <LoaderWraper $isFetching={isFetching}>
      <Loader
        type="ball-spin-fade-loader"
        active
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        color="#CDDDFF"
        style={{ transform: 'scale(1.25)' }}
      />
    </LoaderWraper>
  );
};

