import React, {
    memo,
    useMemo,
    MouseEvent,
    RefObject
} from 'react';

import { Feature, Point } from 'geojson';
import {
    ContentItemsWrapper,
    ItemsWrapper,
    ContentItemContainer,
    ContentItem,
    ContentItemHeader,
    ContentItemBody,
    ContentItemFooter,
    ContentItemTitle,
    ContentItemSubtitle,
    ContentItemDescription,
    RowWrapper,
    FirstPartWrapper,
    FooterIcon,
    FooterText,
    TypeOfOrganization,
    Value,
    ResultsTitle,
    InfoIcon,
    CloseLeftPanel,
    HeaderWrapper,
    HeaderContainer,
    FiltersRow,
    FiltersButton,
    FilterIcon,
    ClearFiltersButton,
    FiltersCount
} from './Elements';
import { SkeletonCard } from '../../../../Loader/SkeletonCard';
import { truncateText } from '../../../../../utils/Text';
//jsx imports

interface Props {
    organizations: Feature<Point, any>[];
    isLoading: boolean | undefined;
    isOpen: boolean;
    dropdownCount: number;
    selectedFeatureId: number | null;
    itemsWrapperRef: RefObject<HTMLDivElement | null>;
    activeFilterCount?: number;
    // callbacks
    setSelectedId: (id: number | null) => void;
    clearAllFilters?: () => void;
    setOpenFiltersModal: (open: boolean) => void;
    onItemClick: (e: MouseEvent<HTMLDivElement>, f: Feature) => void;
    onClose: (e: MouseEvent<HTMLImageElement>) => void;
}

export const OrganizationList: React.FC<Props> = memo(
    ({
        organizations,
        isLoading,
        isOpen,
        dropdownCount,
        selectedFeatureId,
        itemsWrapperRef,
        activeFilterCount = 0,
        setSelectedId,
        clearAllFilters,
        setOpenFiltersModal,
        onItemClick,
        onClose,

    }) => {
        /* local render helpers */

        // console.log('is filtering', isLoading);
        const rType = (t?: string) =>
            t ? (
                <RowWrapper>
                    <FirstPartWrapper>
                        <FooterIcon
                            src="/img/vector/RisingRoutes/cards/type.svg" alt="" />
                        <FooterText style={{ fontWeight: 500 }}>Type of Organization</FooterText>
                    </FirstPartWrapper>
                    <TypeOfOrganization>{truncateText({ text: t, maxLength: 80 })}</TypeOfOrganization>
                </RowWrapper>
            ) : null;


        const rAddress = (pr: any) => {
            const { address, city, state, zip_code } = pr || {};
            if (!address
                || !city
                || !state
                || !zip_code
            ) return null;

            return (
                <RowWrapper>
                    <FirstPartWrapper>
                        <FooterIcon
                            src="/img/vector/RisingRoutes/cards/address.svg" alt="" />
                        <FooterText>Address</FooterText>
                    </FirstPartWrapper>
                    <Value style={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}>
                        {truncateText({ text: [address, city, state, zip_code].join(', '), maxLength: 200 })}
                    </Value>
                </RowWrapper>
            );
        };

        const rMission = (m?: string) =>
            m ? (
                <>
                    <ContentItemSubtitle>Mission</ContentItemSubtitle>
                    <ContentItemDescription>{truncateText({ text: m, maxLength: 180 })}</ContentItemDescription>
                </>
            ) : null;


        const rAmount = (amount?: number) =>
            amount ? (
                <RowWrapper>
                    <FirstPartWrapper>
                        <FooterIcon
                            src="/img/vector/RisingRoutes/cards/amount.svg" alt="" />
                        <FooterText>Amount Requested</FooterText>
                    </FirstPartWrapper>
                    <Value style={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}>
                        ${amount.toLocaleString()}
                    </Value>
                </RowWrapper>
            ) : null;


        const rOAmount = (amount?: number) =>
            amount ? (
                <RowWrapper>
                    <FirstPartWrapper>
                        <FooterIcon
                            src="/img/vector/RisingRoutes/cards/revenue.svg" alt="" />
                        <FooterText>Oega Amount</FooterText>
                    </FirstPartWrapper>
                    <Value style={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}>
                        ${amount.toLocaleString()}
                    </Value>
                </RowWrapper>
            ) : null;


        /* Render */
        const list = useMemo(() => {
            if (isLoading)
                return (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                );

            return organizations.map((f) => (
                <ContentItemContainer
                    key={f.id}
                    data-id={f.id}
                    onClick={(e) => onItemClick(e, f)}>
                    <ContentItem $selected={selectedFeatureId === f.id}>
                        <ContentItemHeader>
                            <ContentItemTitle>{f.properties?.organization_name}</ContentItemTitle>
                        </ContentItemHeader>
                        <ContentItemBody>{rMission(f.properties?.mission)}</ContentItemBody>
                        <ContentItemFooter>
                            {rType(f.properties?.organization_type)}
                            {rAddress(f.properties)}
                            {rAmount(f.properties?.amount_requested)}
                            {rOAmount(f.properties?.oega_amount)}
                        </ContentItemFooter>
                    </ContentItem>
                </ContentItemContainer>
            ));
        }, [isLoading,
            organizations,
            selectedFeatureId,
            onItemClick]);

        return (
            <ContentItemsWrapper
                $selected={isOpen}
                $outOfFocus={dropdownCount > 0}>
                <HeaderWrapper>
                    <HeaderContainer>
                        <ResultsTitle>Results ({organizations.length})</ResultsTitle>
                        <InfoIcon src="/img/raster/RisingRoutes/info.png" />
                        <CloseLeftPanel src="/img/raster/RisingRoutes/cross.png"
                            alt="close"
                            onClick={(e) => {
                                onClose(e);
                                if (clearAllFilters) clearAllFilters();
                                setSelectedId(null);
                            }}
                        />
                    </HeaderContainer>
                    <FiltersRow>
                        <FiltersButton onClick={() => {
                            setOpenFiltersModal(true);
                        }}>
                            <FilterIcon
                                src='/img/raster/RisingRoutes/filter.png'
                                alt='filter icon' />
                            Filters
                            <FiltersCount
                                $isHidden={activeFilterCount === 0}>
                                {activeFilterCount}
                            </FiltersCount>
                        </FiltersButton>
                        <ClearFiltersButton
                            $isHidden={activeFilterCount === 0}
                            $isLoading={isLoading}
                            onClick={clearAllFilters}
                        >
                            Clear filters
                        </ClearFiltersButton>
                    </FiltersRow>
                </HeaderWrapper>
                <ItemsWrapper ref={itemsWrapperRef}>{list}</ItemsWrapper>
            </ContentItemsWrapper>
        );
    }
);


OrganizationList.displayName = 'OrganizationList';
