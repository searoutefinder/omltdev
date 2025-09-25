import { useEffect } from 'react';


const useViewportHeight = () => {
   
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

   
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);
};

export default useViewportHeight;
