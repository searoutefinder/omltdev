import React, { useRef, useMemo, useCallback, useContext, MouseEvent } from 'react'
import {
    SidebarContainer, SidebarContent, HeroSection,
    DonationProgressBar,
    DonationHeader,
    DonationCardWrapper,
    ToggleButton, ToggleIcon,
    IconSupport,
    DonationHeaderTitle, DonationProgressSection, DonationProgressValue, DonationProgressTextWrapper, DonationProgressBranding, TextSectionWrapper,
    FundRaiserWrapper, FundRaiserTextWrapper,
    ContactIcon, FundRaiserTextSection, MailTo,
    DonationButtonContainer, DonationButton, DonationDeadline,
    ShareSection, ShareSectionText, ShareSectionIcons, ShareIcon, ShareSectionWrapper,
    FundRaiserTextElement,
    Wrapper
} from './RightSidebarElements'
import { Image, Slide } from '../RightSidebar/components/ImageCarousel/Elements';
import { MapContext } from '../../../context/CreateContext';
import { DonationInfoProps, ImageProps } from '@/types/preserve-map';
import { handleTouchStart, handleTouchMove, handleTouchEndToggle } from "../../../utils/Gestures/Sidebar";
import { ImageCarousel } from './components/ImageCarousel';


interface CollapsibleSidebarProps {
    styleLoaded: boolean;
    images: ImageProps[];
    isMobile: boolean;
    isCollapsedRight: boolean;
    donationType: string | null | boolean; 
    donationInfo: DonationInfoProps | null;
    owner: string | null;
    setIsCollapsedRight: (isCollapsedRight: boolean) => void;
}

export const RightSidebar = ({ styleLoaded, images, isMobile, isCollapsedRight, donationType, donationInfo, owner, setIsCollapsedRight }: CollapsibleSidebarProps) => {

    //refs 
    const startX = useRef<number | null>(null);
    const currentX = useRef<number | null>(null);
    const { mapState } = useContext(MapContext);

    //handlers  --------------------------
    const handleToggle = useCallback((e: MouseEvent) => {
        setIsCollapsedRight(!isCollapsedRight);
        e.stopPropagation();
        e.preventDefault();
    }, [isCollapsedRight, setIsCollapsedRight]);
   
    
    //Optimization --------------------------    
    const ImageCarouselRender = useMemo(() => (
        <ImageCarousel isMobile={isMobile} handleToggle={handleToggle} images={images} />
    ), [images, isMobile, handleToggle]);

    //donation text
    const DonationText = useMemo(() => {
        if (donationType === null) return;

        if (!donationInfo) return '';
        const donationTextEl = donationInfo.donation_text ? ` ${donationInfo.donation_text}` : '';

        if (donationType === 'trails') {
            return `Your gift helps build a new ${donationInfo.activity} trail, named ${donationInfo.donation_object}, at ${mapState.webMapName} in ${mapState.cityAndState}.${donationTextEl}`;
        }; 
        
        if (donationType === 'POIs') {
            
            //structure
            if (donationInfo.POI_type === 'Structure') {
                return `Your contribution supports the construction of a new structure, ${donationInfo.donation_object}, at ${mapState.webMapName} in ${mapState.cityAndState}.${donationTextEl}`;
            }; 
            //waterfall
            if (donationInfo.POI_type === 'Waterfall') {
                return `Your donation helps create a stunning new waterfall at ${mapState.webMapName} in ${mapState.cityAndState}.${donationTextEl}`;
            };
            //view
            if (donationInfo.POI_type === 'View') {
                return `Your support enhances the scenic view at ${mapState.webMapName} in ${mapState.cityAndState}, making it more accessible and enjoyable for everyone.${donationTextEl}`;
            };
            //obstruction 
            if (donationInfo.POI_type === 'Obstruction') {
                return `Your gift helps clean up an obstruction, at ${mapState.webMapName} in ${mapState.cityAndState}.${donationTextEl}`;
            };
        };
        
    }, [donationInfo, donationType, mapState]);

    //contact email 
    const email = useMemo(() => donationInfo? donationInfo.contact_email : 'null', [donationInfo]);

    //Render --------------------------
    if (!styleLoaded || !donationInfo || !donationInfo.donation_url || donationType === null) return null;

    return (
        <SidebarContainer
            $isCollapsedRight={isCollapsedRight}
        >
            <ToggleButton
                onClick={handleToggle}
            >
                <ToggleIcon
                    src={isCollapsedRight ? '/img/vector/left-arrow.svg' : '/img/vector/right-arrow.svg'}
                    alt={isCollapsedRight ? 'rightArrow' : 'leftArrow'}
                />
            </ToggleButton>
            <SidebarContent>
                <Wrapper>
                    {(!images) ? (
                        <Slide>
                            <Image src={'img/raster/RightSidebar/placeholder-image.png'} alt={`Slide`} />
                        </Slide>
                    ) : ImageCarouselRender}

                    <HeroSection
                        onTouchStart={(e) => handleTouchStart(e, { startX })}
                        onTouchMove={(e) => handleTouchMove(e, { currentX, startX })}
                        onTouchEnd={() =>
                            handleTouchEndToggle({
                                type: 'right',
                                currentX,
                                startX,
                                collapsed: isCollapsedRight,
                                setterIsCollapsed: setIsCollapsedRight
                            })}>
                        <DonationCardWrapper>
                            <DonationHeader>
                                <IconSupport src={"/img/vector/RightSidebar/supportIcon.svg"} />
                                <DonationHeaderTitle>Build this 
                                    {donationType === 'trails' ? ' trail' : donationInfo.POI_type ? ` ${donationInfo.POI_type.toLowerCase()}` : '' }</DonationHeaderTitle>
                            </DonationHeader>

                            <DonationProgressSection>
                                <DonationProgressBar src={'/img/vector/RightSidebar/progressBar.svg'} />
                                <DonationProgressTextWrapper>
                                    <DonationProgressValue>$1,645 raised</DonationProgressValue>
                                    <DonationProgressBranding src={'/img/vector/RightSidebar/brandingIcon.svg'} />
                                </DonationProgressTextWrapper>
                            </DonationProgressSection>

                            <TextSectionWrapper>
                                {DonationText}
                            </TextSectionWrapper>
                            <FundRaiserWrapper>
                                <ContactIcon src={'/img/vector/RightSidebar/donationContact.svg'} />
                                <FundRaiserTextSection>
                                    <FundRaiserTextWrapper>
                                        Want to donate via check?
                                    </FundRaiserTextWrapper>
                                    <FundRaiserTextWrapper>
                                        <FundRaiserTextElement>
                                            {owner} at
                                            <MailTo href={`mailto:${email}`} target="_blank"> {email}</MailTo>
                                        </FundRaiserTextElement>
                                    </FundRaiserTextWrapper>
                                </FundRaiserTextSection>
                            </FundRaiserWrapper>

                            <DonationButtonContainer>
                                <DonationButton href={donationInfo.donation_url} target="_blank" rel="noopener noreferrer">
                                    {donationInfo.donation_url_text}
                                </DonationButton>
                                <DonationDeadline>
                                    Ends in: <b style={{ color: 'black' }}>1 month</b>
                                </DonationDeadline>
                            </DonationButtonContainer>

                        </DonationCardWrapper>
                        <ShareSection>
                            <ShareSectionWrapper>
                                <ShareSectionText>
                                    Share this fundraiser with your network
                                </ShareSectionText>
                                <ShareSectionIcons>
                                    <ShareIcon src={'/img/vector/RightSidebar/shareIcon.svg'} />
                                    <ShareIcon src={'/img/vector/RightSidebar/linkedln.svg'} />
                                </ShareSectionIcons>
                            </ShareSectionWrapper>
                        </ShareSection>
                    </HeroSection>
                </Wrapper>
            </SidebarContent>
        </SidebarContainer>
    )
}
