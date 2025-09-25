import { RefObject } from 'react';

interface FullScreen {
  mapCanvas: RefObject<HTMLDivElement | null>;
  setShowModal: (showModal: boolean) => void;
  setIsFullScreen: (isFullScreen: boolean) => void;
}


export const toggleFullScreen = ({ mapCanvas, setIsFullScreen, setShowModal }: FullScreen) => {
 
  // Check if currently in fullscreen mode (native or fallback)
  const isFullScreen = !!document.fullscreenElement || !!(document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement || mapCanvas.current?.style.position === 'fixed';

  // Native exit fullscreen
  const exitFullscreen: (() => Promise<void>) | undefined =
    document.exitFullscreen ||
    (document as Document & { webkitExitFullscreen?: () => Promise<void>; msExitFullscreen?: () => Promise<void> }).webkitExitFullscreen ||
    (document as Document & { webkitExitFullscreen?: () => Promise<void>; msExitFullscreen?: () => Promise<void> }).msExitFullscreen;

  // Native request fullscreen
  const requestFullscreen: (() => Promise<void>) | undefined =
    mapCanvas.current?.requestFullscreen ||
    (mapCanvas.current as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> })?.webkitRequestFullscreen ||
    (mapCanvas.current as HTMLElement & { msRequestFullscreen?: () => Promise<void> })?.msRequestFullscreen;

  if (isFullScreen) {
    //1.1.Exit fullscreen mode - NATIVE API 
    if (exitFullscreen) {
      exitFullscreen.call(document);
      setIsFullScreen(false);
      //1.2.Iphones fix  
    }  else {
      setShowModal(false);
    }
  } else {
    //2.1. Enter fullscreen mode  NATIVE API ---------------------
    if (requestFullscreen) {
      requestFullscreen.call(mapCanvas.current).catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
      setIsFullScreen(true);
      //2.2.Iphones fix  
    } else {
      setShowModal(true);
    } 
  }
};


