import React from 'react';
import { Container, Content, Title, CloseButton, Instructions, StepsList, Step } from './Elements';
interface FullScreenModalProps { 
    isMobile: boolean;
    isIOS: boolean;
    isFullScreen: boolean;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

export const FullScreenModal = ({ isMobile, isIOS, showModal, setShowModal }: FullScreenModalProps) => {
    if (!isMobile || !isIOS) return null;

    return (
        <Container $showModal={showModal}>
            <Content>
                <Title>Enable Full Screen</Title>
                <CloseButton onClick={() => { setShowModal(false); }}>Close Modal</CloseButton>
                <Instructions>To enable full screen on your iPhone, please follow these steps:</Instructions>
                <StepsList>
                    <Step>Tap the &quot;Share&quot; button at the bottom of the screen.</Step>
                    <Step>Select &quot;Add to Home Screen&quot; from the list of options.</Step>
                    <Step>Tap &quot;Add&quot; in the top right corner of the screen.</Step>
                </StepsList>
                <Instructions>Once added, you can open the app from your home screen in full screen mode.</Instructions>
            </Content>
        </Container>
    );
};
