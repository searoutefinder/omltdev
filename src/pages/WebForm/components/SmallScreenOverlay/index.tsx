import React from 'react';
import { Container, MainText, WarningText, HomeElement } from './Elements';


interface SmallScreenOverlayProps {
    isMobile: boolean;
};


export const SmallScreenOverlay = ({isMobile}:SmallScreenOverlayProps) => {
 
  if (isMobile || window.innerWidth < 765 || window.innerHeight < 450) {
   
    return (
      <Container>
        <HomeElement>
        </HomeElement>
        <MainText> Head to your nearest desktop computer! </MainText>
        <WarningText> Sorry, Omlt interface isn&apos;t quite ready for mobile devices like yours.</WarningText>
      </Container>
  
    )
  } 

  return null;
 
};

