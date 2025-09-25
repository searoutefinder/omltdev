import React, { useState, useRef, MouseEvent, RefObject } from "react";
import {
  SidebarContainer, SidebarContent, ToggleButton, ItemName, ItemsWrapper, ItemContainer, UsageTypeIcon, RevealIcon, IconsContainer, TextSection, ItemHeader, SeparationLine, ItemInfoContainer, TrailsDetails,
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
  ActivityIconsWrapper,
  ActivityIcon,
  SidebarSubTitleTextItem,
  SidebarParkingTextElement,
  ParkingLocationLink,
  Label
} from "./LeftSidebarElements";
import { useParams } from "react-router-dom";
import Loader from 'react-loaders';
//types 
import { DonationInfoProps, ImageProps } from "../../../../types/preserve-map";
//utils
import { SidebarDataProps } from "../../../../utils/preserve-map/getSidebarData";
import { handleSidebarToggle, handleTouchStart, handleTouchMove, handleTouchEndToggle } from "../../../../utils/Gestures/Sidebar";
import { getDistanceWithUnit, getActivityIcons } from "../../../../utils/LeftSidebar";
import { parseStringsToArray } from "../../../../utils/Text";

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
  description: string | null;
  parking_address: string | null;
  parking_coordinates: [number, number] | null;
  type: string | null;
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
  setDonationInfo: (donationInfo: DonationInfoProps) => void;
}

// EDITS ---------------------------------------------------------------------- 
// #fix - refactor this component into smaller components
// #fix - add skeleton loader here
// #fix - wrapp donation info into single object
// #fix - useMemo for logoURL
// #fix - memo for all jsx elements

export const LeftSidebar = ({
  map,
  isMobile,
  styleLoaded,
  webMapName,
  description,
  parking_address,
  parking_coordinates,
  owner,
  type,
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
  const { preserveName } = useParams<{ preserveName: any }>();

  //refs 
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);

  //states 
  const [infoModal, setInfoModal] = useState<boolean>(false);

  //#fix + api state source checker in later stage
  if (!styleLoaded || !dataLoaded || !sidebarData || !webMapName || !owner) return null;

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


  //attribute helper function
  //#fix - refactor/optimize for all other jsx elements 
  const returnMinWidth = (min_width: number | null) => {
    if (!min_width) return;
    return (
      <TrailsDetailesLine>
        <Attribute>
          <SpecsIcon src={'/img/vector/LeftSidebar/min-width.svg'} />
          MIN WIDTH
        </Attribute>
        <Value>{min_width}</Value>
      </TrailsDetailesLine>
    );
  };


  const returnSurface = (surface: string | null) => {
    if (!surface) return;
    return (
      <TrailsDetailesLine>
        <Attribute>
          <SpecsIcon src={'/img/vector/LeftSidebar/surface.svg'} />
          SURFACE
        </Attribute>
        <Value>{surface}</Value>
      </TrailsDetailesLine>
    );
  };

  const returnHeader = (
    desc: string | null,
    parking_address: string | null,
    parking_coordinates: [number, number] | null) => {
    if (!desc) return;
    const preserveUrl = preserveName?.replace(/([A-Z])/g, ' $1').trim();

    const BackTo = (preserveUrl === webMapName) ? null : (
      <BackToWebsite>
        <Link href={WixUrlMap[webMapName as keyof typeof WixUrlMap]} target="_blank" rel="noreferrer">
          Back to {webMapName} website
          <GreenArrow style={{ marginLeft: '3px', marginBottom: '-2px' }} src={'/img/vector/LeftSidebar/rightGreenArrow.svg'} />
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
        <SidebarParkingTextElement>
          <Label>Parking:</Label>
          <ParkingLocationLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              parking_coordinates && parking_coordinates.length === 2
                ? `${parking_coordinates[1]},${parking_coordinates[0]}`
                : parking_address || "<unknown ad>"
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            {parking_address}
          </ParkingLocationLink>
        </SidebarParkingTextElement>
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



  const returnActivityIcons = (allowedActs: string, prohibitedActs: string) => {
    const allowedActsParsed = parseStringsToArray(allowedActs);
    const prohibitedActsParsed = parseStringsToArray(prohibitedActs);

    const allowedIcons = getActivityIcons(allowedActsParsed, prohibitedActsParsed);
    const prohibitedIcons = getActivityIcons(prohibitedActsParsed, allowedActsParsed);

    if (!allowedIcons.length && !prohibitedIcons.length) return null;
    return (
      <>
        <SeparationLine $isItemOpen={true} />
        <ActivityIconsWrapper>
          {allowedIcons.map((icon, index) => (
            icon && <ActivityIcon key={`allowed-${index}`} src={icon} alt={`allowed-icon-${index}`} />
          ))}

          {prohibitedIcons.map((icon, index) => (
            icon && <ActivityIcon key={`prohibited-${index}`} src={icon} alt={`prohibited-icon-${index}`} />
          ))}
        </ActivityIconsWrapper>
      </>

    );
  };


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
          setterIsCollapsed: setIsCollapsedLeft
        })}
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
                  <SidebarSubTitleTextItem>
                    {type === 'Transfer' ? '(State Transfer)' : `(${type})`}
                  </SidebarSubTitleTextItem>
                </SidebarSubTitleText>
                <InfoIcon src={'/img/vector/LeftSidebar/info.svg'} onClick={() => setInfoModal(true)} />
                <InfoModal isMobile={isMobile} isOpen={infoModal} setIsOpen={setInfoModal} />
              </SidebarSubTitleSection>
            </TitleContainer>
          </SideBarHeader>
          {returnHeader(description, parking_address, parking_coordinates)}
          {!isCollapsedLeft && (

            <ItemsWrapper ref={itemsWrapperRef}>
              {sidebarData.map((item, index) => (
                <ItemContainer
                  key={index}
                  data-id={item.id}
                  $isItemOpen={item?.id === openItemIndex}
                  $ItemHighlight={item?.id === selectedTrailId}
                  onClick={(e) => handleItemHiglighting(e, item.id as number)}>
                  <ItemHeader $isItemOpen={item?.id === openItemIndex}>
                    <ItemName>{item?.trail_name}</ItemName>
                    <IconsContainer>
                      <UsageTypeIcon src={`/img/vector/Trail-Usage/${item.activity.toLowerCase()}.svg`} />
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
                        <Value>{(item.max_grade) ? `${item?.max_grade}%` : 'unknown'}</Value>
                      </TrailsDetailesLine>
                      {returnMinWidth(item.min_width)}
                      <TrailsDetailesLine>
                        <Attribute>
                          <SpecsIcon src={'/img/vector/LeftSidebar/distance.svg'} />
                          DISTANCE
                        </Attribute>
                        <Value>{getDistanceWithUnit(item.distance)}</Value>
                      </TrailsDetailesLine>
                      {returnSurface(item.surface)}
                    </TrailsDetails>
                    {returnActivityIcons(item.allowed_acts, item.prohibited_acts)}
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