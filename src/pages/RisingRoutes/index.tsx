import React, { useContext, lazy } from 'react';
import { SavedContext } from '../../context/CreateContext';

const RisingRoutesDesktop = lazy(() => import('../../components/RisingRoutesMap/desktop'));
const RisingRoutesMobile = lazy(() => import ('../../components/RisingRoutesMap/mobile'));

const RisingRoutesPage = () => {
    const { isMobile } = useContext(SavedContext)
    return isMobile 
      ? (<RisingRoutesMobile isMobile = {isMobile} />) 
      : (<RisingRoutesDesktop isMobile = {isMobile}/>)
}

export default RisingRoutesPage;


