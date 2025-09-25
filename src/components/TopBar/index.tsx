import React from 'react';
import { TopBarContainer, BrandIcon, TitleEl, FullScreenButton, FullScreenIcon } from './TopBarElements';
import { toggleFullScreen } from '../../utils/FullScreen';
import { RefObject } from 'react';

interface FullScreen {
  mapCanvas: RefObject<HTMLDivElement | null>;
  isFullScreen: boolean;
  webMapName: string | null;
  setIsFullScreen: (isFullScreen: boolean) => void;
  setShowModal: (showModal: boolean) => void;
}

const TopBar = ({ mapCanvas, isFullScreen, webMapName, setIsFullScreen, setShowModal }: FullScreen) => {

  return (
    <TopBarContainer>
      <BrandIcon
        src='/img/vector/logo.svg'
        alt='logo'
        onClick={() => {
          //catch topmost window - ignore iframe
          if (window.top) {
            window.top.location.href = 'https://www.greengoatmaps.com/';
          }
        }}
      />
      <TitleEl>
        {webMapName}
      </TitleEl>

      <FullScreenButton onClick={() => toggleFullScreen({ mapCanvas, setIsFullScreen, setShowModal })}>
        <FullScreenIcon
          src={isFullScreen ? '/img/vector/fullScreenOut.svg' : '/img/vector/fullScreenEnter.svg'}
          alt='fullScreen'
        />
      </FullScreenButton>
    </TopBarContainer>
  );
};

export default TopBar;
