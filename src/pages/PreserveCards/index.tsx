import React, { useState, useContext, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from "react-router-dom";
//context
import { SavedContext } from "../../context/CreateContext";
//types
import { CardDataProps } from '../../types/cards';
//styles
import { SkeletonContainer } from '../../components/Loader/Elements';
import { Container, CardsWrapper, NavArrow, NavArrowIcon } from './Elements';
//jsx
import { PreserveCard } from '../../components/PreserveCards/PreserveCard';
import { Pagination } from '../../components/PreserveCards/Pagination';
//hooks
import { useDataFetcher } from '../../hooks/UseEffect/cards/useDataFetcher';
import { useCardSwiper } from '../../hooks/UseEffect/cards/useCardsSwiper';
import { useResizeObserver } from '../../hooks/UseEffect/mobiles/useResizeObserver';

const PreserveCardsPage = () => {
  const { isMobile, isIOS} = useContext(SavedContext);
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get("serviceName");
  const orgId = searchParams.get("orgId");
  //refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  //states
  const [data, setData] = useState<CardDataProps[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);


  //hooks ==============================
  useDataFetcher({
    orgId: orgId,
    serviceName: serviceName,
    setIsFetching: setIsFetching,
    setData: setData
  });

  const cardsPerView = useResizeObserver({
    ref: containerRef,
    width: 290,
    gap: 20
  });

  const {
    canLeft: canLeftMobile,
    canRight: canRightMobile,
    scrollByCard,
    refresh } = useCardSwiper(cardsRef, isMobile, 5, cardsPerView, isIOS);

  useEffect(() => {
   if (isMobile) refresh();
}, [isMobile, 
    data.length, 
    cardsPerView, 
    refresh]);
  
 



  //pagination ===========================
  const cardsPerPage: number | null = useMemo(() => {
    return cardsPerView;
  }, [cardsPerView])

  const paginatedData = useMemo(() => {
    if (isMobile) {
      return data;
    }
    const start = page * cardsPerPage;
    return data.slice(start, start + cardsPerPage);
  }, [data,
    isMobile,
    page,
    cardsPerPage])

  const totalPages = useMemo(() => {
    if (isMobile) {
      return 1;
    }
    return Math.ceil(data.length / cardsPerPage);
  }, [data.length,
    isMobile,
    cardsPerPage]);
  //==========================

  //navigations ======================= 
  const canLeftDesk = !isMobile && page > 0;
  const canRightDesk = !isMobile && page < totalPages - 1;

  //mini helpers
  const canLeft = isMobile ? canLeftMobile : canLeftDesk;
  const canRight = isMobile ? canRightMobile : canRightDesk;

  const handleLeft = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile) scrollByCard('prev');
    else setPage(p => Math.max(0, p - 1));
  };

  const handleRight = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile) scrollByCard('next');
    else setPage(p => Math.min(totalPages - 1, p + 1));
  };

  // ===================================





  //loader jsx
  const isLoading = useMemo(() => {
    return data.length == 0
      || isFetching
      || isMobile == undefined
  }, [isMobile,
    data,
    isFetching]);

  const LoaderRender = useMemo(() => {
    if (!isLoading) return null;
    return (
      <SkeletonContainer />
    )
  }, [isLoading])


  return (
    <Container
      ref={containerRef}>
      {LoaderRender}
      {canLeft && (
        <NavArrow
          side="left"
          disabled={!canLeft}
          onClick={(e) => handleLeft(e)}
        >
          <NavArrowIcon
            src="/img/raster/PreserveCards/Navigation/left.png"
            alt="Left Arrow"
          />
        </NavArrow>
      )}

      {canRight && (
        <NavArrow
          side="right"
          disabled={!canRight}
          onClick={(e) => handleRight(e)}
        >
          <NavArrowIcon
            src="/img/raster/PreserveCards/Navigation/right.png"
            alt="Right Arrow"
          />
        </NavArrow>
      )}


      <CardsWrapper
        ref={cardsRef}
        $isLastPage={page === totalPages - 1}
        $cardsPerPage={cardsPerPage}
        $isMobile={isMobile}
      >
        {paginatedData.map((card) => (
          <PreserveCard
            key={card.OBJECTID}
            orgId={orgId}
            serviceName={serviceName}
            card={card}
            isMobile={isMobile}
            data-card
          />
        ))}
      </CardsWrapper>
      {!isMobile && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          isLoading={isLoading}
          setPage={setPage}
        />
      )}
    </Container>
  )
};


export default PreserveCardsPage;