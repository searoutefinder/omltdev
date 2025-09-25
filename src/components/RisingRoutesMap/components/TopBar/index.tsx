import React, {RefObject} from 'react';
import { TopBarContainer, LogoIcon, TitleEl} from './Elements';

interface FullScreen {
  mapCanvas?: RefObject<HTMLDivElement | null>;
  isFullScreen?: boolean;
  webMapName: string | null;
  setIsFullScreen?: (isFullScreen: boolean) => void;
  setShowModal?: (showModal: boolean) => void;
}

const TopBar = ({ webMapName }: FullScreen) => {

  return (
    <TopBarContainer>
      <LogoIcon
        src='/img/raster/RisingRoutes/logo.png'
        alt='logo'
        onClick={() => {
          if (window.top) {
            window.top.location.href = 'https://www.risingroutes.org';
          }
        }}
      />
      <TitleEl>
        {webMapName}
      </TitleEl>
    </TopBarContainer>
  );
};

export default TopBar;
