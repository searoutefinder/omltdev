import { useEffect, useRef, useState, useMemo} from 'react';
//types
import { PreserveCardProps, ImageProps,} from '../../../types/cards';
//styles
import {
    CardContainer,
    ActivityBanner,
    Header,
    Footer,
    Col1,
    Title,
    SubTitle,
    InfoContainer,
    DescriptionContainer,
    Description,
    Value,
    Attribute,
    InfoItem,
    ExploreButton,
    ShowMoreText,
    ExploreLink
} from './Elements';
//hooks
import { useImageFetcher } from '../../../hooks/UseEffect/cards/useImageFetcher';
import {useOverflow} from '../../../hooks/UseEffect/useIsOverflow';
//jsx
import { ImageCarousel } from '../ImageCarousel/';
import { SkeletonTrailCard } from '../../../components/Loader/PreserveCard';
import { ActivityIconsSection, ReturnLogoElement } from './components';
//utils
import { truncateText} from '../../../utils/Text';


export const PreserveCard = ({
    orgId: orgId,
    serviceName: serviceName,
    card: card,
    isMobile: isMobile
}: PreserveCardProps) => {

    //========== refs ========================== 
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    //========== states =======================
    const [cardIsReady, setIsCardReady] = useState(false);
    //image URLs
    const [logoURL, setLogoURL] = useState<ImageProps[] | []>([]); //set logo URL for Owner and Maintainer URL for card
    const [imagesURLs, setImagesURLs] = useState<ImageProps[]>([]);
    const [insetMapURL, setInsetMapURL] = useState<string | null>(null);
    //descriptions
    const [expanded, setExpanded] = useState(false);
    const [atBottom, setAtBottom] = useState(false);
    //inset map
    const [isMapHovered, setIsMapHovered] = useState(false);

    //transitions
    //#FIX - extract to the top level as global configs to be able to tweak per CMS layout
    //max length of description  
    const maxLength = 160;



    //HOOKS ===========================
    //1. fetchImages
    useImageFetcher({
        orgId: orgId,
        serviceName: serviceName,
        objectId: card.OBJECTID,
        setLogoURL: setLogoURL,
        setImageURLs: setImagesURLs,
        setInsetMapURL: setInsetMapURL,
        setIsCardReady: setIsCardReady
    })


    //2. scroll to top on description expand/collapse
    useEffect(() => {
        if (!expanded && descriptionRef.current) {
            descriptionRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [expanded]);


    //3. check if description container is at the bottom to remove mask-image effect
    useEffect(() => {
        const el = descriptionRef.current;
        if (!el) return;

        const handleScroll = () => {
            const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
            setAtBottom(isAtBottom);
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);


    //4. check if description is scrollable
     const isScrollable = useOverflow(descriptionRef, cardIsReady);
    // ======================================================================
  
    // OPT ================================================================== 
    // 1. create explore href
        const exploreHref = useMemo(() => {
        const base = card.preserve_page_url as string;
        const qs = window.location.search;
        const sep = base.includes('?') ? '&' : '?';
        return qs ? `${base}${sep}${qs.slice(1)}` : base;
    }, [card.preserve_page_url]);

    //2. activity banner
    const activityBanner = useMemo(() => {
        return card.dominant_activity && card.dominant_activity !== 'None' ? (
            <ActivityBanner src={`/img/raster/PreserveCards/Activity/${card.dominant_activity}.svg`} alt={'actsBan'} />
        ) : null;
    }, [card.dominant_activity]);

    //3. skeleton loader card
    const skeletonCard = useMemo(() => {
        if (!cardIsReady) {
            return (
             <SkeletonTrailCard />
            )
        }
        return null;
    }, [cardIsReady]);

    //4. hasTrailData
    const hasTrailData = useMemo(() => {
        return (
            typeof card.total_distance === 'number' &&
            card.total_distance > 0 &&
            typeof card.elevation_gain === 'number' &&
            typeof card.dominant_activity === 'string' &&
            typeof card.dominant_surface === 'string'
        );
    }, [card]);

    if (skeletonCard) return skeletonCard;

    //render main jsx
    return (
        <CardContainer
            data-card
        >
            {activityBanner}
            <ImageCarousel
                isMobile={isMobile}
                imageURLs={imagesURLs}
                insetMapURL={insetMapURL}
                exploreHref={exploreHref}
                setIsMapHovered={setIsMapHovered}
            />
            <Header>
                {ReturnLogoElement(logoURL)}
                <Col1>
                    <Title>
                        {card.preserve_name}
                    </Title>
                    <SubTitle>
                        {card.owner}
                    </SubTitle>
                </Col1 >
            </Header>
            <InfoContainer $hasTrailData={hasTrailData}>
                <InfoItem>
                    <Value>{card.total_distance} mi</Value>
                    <Attribute>Total Trails</Attribute>
                </InfoItem>
                <InfoItem>
                    <Value>{card.dominant_surface}</Value>
                    <Attribute>Trail Surface</Attribute>
                </InfoItem>
                <InfoItem>
                    <Value>{card.elevation_gain} ft</Value>
                    <Attribute>Elevation Gain</Attribute>
                </InfoItem>
            </InfoContainer>
            <DescriptionContainer
                ref={descriptionRef}
                $hasTrailData={hasTrailData}
                $expanded={expanded}
                $atBottom={atBottom}>
                   <Description>
                    {expanded
                        ? card.preserve_description
                        : truncateText({
                            text: card.preserve_description,
                            maxLength: !hasTrailData ? 250 : maxLength
                        })}
                    
                    {isScrollable && (
                        <ShowMoreText onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Show Less ▲' : 'Show More ▼'}
                        </ShowMoreText>
                    )}
                </Description>   
            </DescriptionContainer>
            <Footer>
                <ActivityIconsSection
                    allowedActs={card.allowed_acts}
                    prohibitedActs={card.prohibited_acts} />
                <ExploreLink
                    href={exploreHref}
                    target="_top"
                    rel="noopener noreferrer">
                    <ExploreButton $isFocused={isMapHovered}>
                        Explore
                    </ExploreButton>
                </ExploreLink>
            </Footer>
        </CardContainer >
    )
};



