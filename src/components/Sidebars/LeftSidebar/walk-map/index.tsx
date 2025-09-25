import React, {useState,useRef, MouseEvent, RefObject} from "react";
import {
  SidebarContainer, SidebarContent, ToggleButton, ItemName, ItemsWrapper, ItemContainer,  RevealIcon, IconsContainer, TextSection, ItemHeader, SeparationLine, ItemInfoContainer, TrailsDetails,
  TrailsDetailesLine,
  SpecsIcon,
  Value,
  Attribute,
  FundraisingSection,
  FundraisingSectionLeft,
  FundraisingSectionRight,
  GreenArrow,
  SideBarHeader,
  SidebarTitle,
  SidebarSubTitleSection,
  SidebarSubTitleText,
  BadgeContainer,
  BadgeOne,
  BadgeTwo,
  TitleContainer,
  InfoIcon,
  ToggleIcon,
  SidebarDescription,
  BackToWebsite,
  Link,

  SidebarSubTitleTextItem
} from "./LeftSidebarElements";
import { useParams } from "react-router-dom";
import Loader from 'react-loaders'; 
//types 
import {  ImageProps } from "../../../../types/preserve-map";
//utils
import { SidebarDataProps } from "../../../../utils/getSidebarData";
import { handleSidebarToggle, handleTouchStart, handleTouchMove, handleTouchEndToggle } from "../../../../utils/Gestures/Sidebar";
import { getDistanceWithUnit} from "../../../../utils/LeftSidebar";

//fcns
import { InfoModal } from "../InfoModal";
import { WixUrlMap } from "../../../../constants/dataMapping";


//types
interface CollapsibleSidebarProps {
  map: mapboxgl.Map | null;
  isMobile: boolean;
  styleLoaded: boolean;
  webMapName: string | null;
  owner: string | null;
  logoURL: ImageProps[] | [];
  dataLoaded: boolean;
  sidebarData: SidebarDataProps[] | null;
  isCollapsedLeft: boolean;
  selectedTrailId: number | null;
  openItemIndex: number | null;
  hasSetDonationInfo: React.MutableRefObject<boolean>;
  isLoading: boolean;
  itemsWrapperRef: RefObject<HTMLDivElement | null>; 
  setIsCollapsedLeft: (collapsed: boolean) => void;
  setSelectedTrailId: (selectedTrailId: number | null) => void;
  setOpenItemIndex: (openItemIndex: number | null) => void;
  setIsCollapsedRight: (isCollapsedRight: boolean) => void;
}

// EDITS ---------------------------------------------------------------------- 
// #fix - refactor this component into smaller components
// #fix - add skeleton loader here
// #fix - wrapp donation info into single object
// #fix - useMemo for logoURL
// #fix - memo for all jsx elements


//#Tamas 5. - I created here LeftSidebar component for WalkMap. You can clean this as you go and add more functionality.
export const LeftSidebar = ({ 
  map, 
  isMobile,  
  styleLoaded, 
  webMapName, 
  owner,
  logoURL, 
  dataLoaded, 
  sidebarData, 
  isCollapsedLeft, 
  selectedTrailId, 
  openItemIndex, 
  hasSetDonationInfo, 
  isLoading,
  itemsWrapperRef,
  setIsCollapsedLeft, 
  setSelectedTrailId, 
  setOpenItemIndex, 
  setIsCollapsedRight, 
  }: CollapsibleSidebarProps) => {
 
  //get name from URL;
  const { preserveName } = useParams<{ preserveName: any}>();

  //refs 
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  
  //states 
  const [infoModal, setInfoModal] = useState<boolean>(false);

  if (!styleLoaded || !dataLoaded || !sidebarData || !webMapName || !owner)  return null;

  //handlers  --------------------------
  const handleToggle = (e: MouseEvent) => {
    handleSidebarToggle(map, isCollapsedLeft, isMobile);
    setIsCollapsedLeft(!isCollapsedLeft);
    e.stopPropagation();
    e.preventDefault();
  };


  const handleRevealClick = (e: MouseEvent, trailIndex: number | null) => {
    if (trailIndex === null) return;
    setOpenItemIndex(openItemIndex === trailIndex ? null : trailIndex);
    setSelectedTrailId(trailIndex);

    if (trailIndex === selectedTrailId) return;
  };


  const handleItemHiglighting = (e: MouseEvent, trailIndex: number | null) => {
    if (trailIndex === undefined || trailIndex === selectedTrailId) return;
    setSelectedTrailId(trailIndex);
  };
 

  const handleDonationCard = (e: MouseEvent) => { 
    if (!hasSetDonationInfo.current) return;
    setIsCollapsedRight(false);
    e.stopPropagation();
    e.preventDefault();
  };




  const returnHeader = (desc: string | null) => {
    if (!desc) return;
    const preserveUrl = preserveName?.replace(/([A-Z])/g, ' $1').trim();
    
    const BackTo = (preserveUrl === webMapName) ? null : (
      <BackToWebsite>
        <Link href={WixUrlMap[webMapName as keyof typeof WixUrlMap]} target="_blank" rel="noreferrer">
          Back to {webMapName} website
          <GreenArrow style = {{marginLeft:'3px', marginBottom:'-2px'}} src={'/img/vector/LeftSidebar/rightGreenArrow.svg'} />
        </Link>
      </BackToWebsite>
    );

    const FundRaiserOportunity = (!hasSetDonationInfo.current) ? null : (
      <FundraisingSection>
      <FundraisingSectionLeft>Fundraiser opportunity</FundraisingSectionLeft>
      <FundraisingSectionRight
        onClick={handleDonationCard}>
        Support the Preserve
        <GreenArrow src={'/img/vector/LeftSidebar/rightGreenArrow.svg'} />
      </FundraisingSectionRight>
    </FundraisingSection>
    );
    
    return (
      <SidebarDescription>
        <TextSection>
          {desc}
        </TextSection>
          {FundRaiserOportunity}
          {BackTo}
      </SidebarDescription>
    )
  };


  const returnLogoElement = (logoURL: ImageProps[] | []) => { 
    
     const logoRegex = /Maintainer|Owner|maintainer|owner/;
        const logos = logoURL?.filter((a: any) => logoRegex.test(a.name));
 
    
        if (logos?.length === 0) return (
            <BadgeContainer>
                <BadgeOne src={'/img/raster/LeftSidebar/placeholder_owner_logo.png'} alt='Placeholder_owner_logo' />
            </BadgeContainer>
        );

        const maintainer = logos?.find((item) => item.name?.toLowerCase().includes('maintainer'));
        const owner = logos?.find((item) => item.name?.toLowerCase().includes('owner'));

        if (logos?.length === 1) {
            return (
                <BadgeContainer>
                    <BadgeOne src={maintainer ? maintainer.url : logos[0].url} alt="Logo 1" />
                </BadgeContainer>
            );
        }
    
        if (logos?.length >= 2) {
            return (
                <BadgeContainer>
                    <BadgeOne src={maintainer?.url} />
                    <BadgeTwo src={owner?.url} />
                </BadgeContainer>
            );
        }
};

////#Tamas 10: river walk desc. as I said, feel free to hardcode things. I have no idea how this map type will "envolve"..my usual flow with alexa and ezra was to hardcoded things first, 
// and then once i see things are stable and no any new robust feature is coming, I define data model and refactor it to be dynamic....(connection with backend, new hooks, context, etc).  
const description = "River walk desc"



  //render --------------------------
  return (
    <SidebarContainer
      $isCollapsedLeft={isCollapsedLeft}
      $isLoading={isLoading}
      onTouchStart={(e) => handleTouchStart(e, { startX })}
      onTouchMove={(e) => handleTouchMove(e, { currentX, startX })}
      onTouchEnd={() => 
        handleTouchEndToggle({
        type: 'left',
        currentX, 
        startX, 
        collapsed: isCollapsedLeft,
        setterIsCollapsed: setIsCollapsedLeft})} 
    >
        <ToggleButton onClick={handleToggle}>
          <ToggleIcon
            src={isCollapsedLeft ? '/img/vector/right-arrow.svg' : '/img/vector/left-arrow.svg'}
            alt={isCollapsedLeft ? 'rightArrow' : 'leftArrow'}
          />
        </ToggleButton>
        {isLoading ? (
               <Loader
                 type="ball-spin-fade-loader"
                 active
                 //#FIX - add skeleton loader here
                 //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                 //@ts-expect-error
                 color="#CDDDFF"
                 style={{ transform: 'scale(1.25)' }}
               />
             ) : (

       <SidebarContent>
        <SideBarHeader>
          {returnLogoElement(logoURL)}
          <TitleContainer>
            <SidebarTitle>
              {webMapName}
            </SidebarTitle>
            <SidebarSubTitleSection>
              <SidebarSubTitleText>
                <SidebarSubTitleTextItem>
                  Owner: {owner} 
                </SidebarSubTitleTextItem>
              </SidebarSubTitleText>
              <InfoIcon src={'/img/vector/LeftSidebar/info.svg'} onClick={() => setInfoModal(true)} />
              <InfoModal isMobile = {isMobile} isOpen={infoModal} setIsOpen={setInfoModal} /> 
            </SidebarSubTitleSection>
          </TitleContainer>
        </SideBarHeader>
        {returnHeader(description)}
        {!isCollapsedLeft && (
          
          <ItemsWrapper ref = {itemsWrapperRef}>
            {sidebarData.map((item, index) => (
              <ItemContainer
                key={index}
                data-id={item.id} 
                $isItemOpen={item?.id === openItemIndex}
                $ItemHighlight={item?.id === selectedTrailId}
                onClick={(e) => handleItemHiglighting(e, item.id as number)}>
                <ItemHeader $isItemOpen={item?.id === openItemIndex}>
                  <ItemName>{item?.name}</ItemName>
                    <IconsContainer>
                    <RevealIcon
                      src={item?.id === openItemIndex
                        ? `/img/vector/LeftSidebar/collapse.svg`
                        : `/img/vector/LeftSidebar/expand.svg`
                      }
                      onClick={(e) => (handleRevealClick(e, item.id as number))}
                    />
                    </IconsContainer>
                </ItemHeader>
                <ItemInfoContainer $isItemOpen={item?.id === openItemIndex}>
                  <TextSection>
                    {item?.description}
                  </TextSection>
                  <SeparationLine $isItemOpen={item?.id === openItemIndex} />
                  <TrailsDetails>
                    <TrailsDetailesLine>
                      <Attribute>
                        <SpecsIcon src={'/img/vector/LeftSidebar/max-grade.svg'} />
                        MAX GRADE
                      </Attribute>
                    </TrailsDetailesLine>
                    <TrailsDetailesLine>
                      <Attribute>
                        <SpecsIcon src={'/img/vector/LeftSidebar/distance.svg'} />
                        DISTANCE
                      </Attribute>
                      <Value>{getDistanceWithUnit(item.distance)}</Value>
                    </TrailsDetailesLine>
                  </TrailsDetails>
                </ItemInfoContainer>
              </ItemContainer>

            ))}
          </ItemsWrapper>
        )}
      </SidebarContent>   
             )
          }
    </SidebarContainer>
  );
}
