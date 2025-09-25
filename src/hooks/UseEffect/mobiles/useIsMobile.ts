import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

//helpers ------------------------
function getWindowDimensions() {
  if (typeof window !== 'undefined') {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  return { width: 0, height: 0 };
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    
    const handleResize = debounce(() => {
      const newDimensions = getWindowDimensions();
      setWindowDimensions((currentDimensions) => {
        if (
          currentDimensions.width !== newDimensions.width ||
          currentDimensions.height !== newDimensions.height
        ) {
          return newDimensions;
        }
        return currentDimensions;
      });
    }, 500);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};


// Function to detect if the device is iOS
const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false); 
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      if (
        /android|iPad|iPhone|iPod|opera mini|iemobile/i.test(userAgent.toLowerCase())
      ) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
      setIsIOS(isIOSDevice());
    };

    checkIsMobile();
  }, [width, height, setIsMobile, setIsIOS]);

  return { isMobile, isIOS }; 
}



// ----------------------------------------------------------------------------------------------

//exports
export const useDeviceInfo = () => {
  const windowDimensions = useWindowDimensions();
  const { isMobile, isIOS } = useIsMobile();

  return { ...windowDimensions, isMobile, isIOS };
};
