import {useEffect} from 'react'
import { handleSidebarToggle } from '../../utils/Gestures/Sidebar';

interface sidebarControllerProps { 
    mapInstance: mapboxgl.Map | null;
    isMobile: boolean;
    isCollapsedRight: boolean;
    setIsCollapsedRight: (isCollapsedRight: boolean) => void;
    isCollapsedLeft: boolean;
    setIsCollapsedLeft: (isCollapsedLeft: boolean) => void;
  
};


export const SidebarController = ({mapInstance, isMobile, isCollapsedRight, isCollapsedLeft, setIsCollapsedRight, setIsCollapsedLeft}: sidebarControllerProps) => {
       
   useEffect(() => { 
        if (mapInstance && !isCollapsedRight && !isCollapsedLeft) {
            handleSidebarToggle(mapInstance, isCollapsedLeft, isMobile);
        }
   }, [isCollapsedLeft, isCollapsedRight, isMobile, mapInstance]);


    useEffect(() => {
        if (!isCollapsedRight && isMobile ) {
            setIsCollapsedLeft(true);
        }
    }, [isCollapsedRight, isMobile, setIsCollapsedLeft]);


    useEffect(() => {
        if (!isCollapsedLeft && isMobile) {
            setIsCollapsedRight(true);
        }

    }, [isCollapsedLeft, isMobile, setIsCollapsedRight]);
    
    return null;
};