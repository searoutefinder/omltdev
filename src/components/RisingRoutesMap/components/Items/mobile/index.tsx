import React, {
    memo,
    useMemo,
    forwardRef
} from 'react';

import { Feature, Point } from 'geojson';
import {
    ContentItemContainer,
    ContentItem,
    ContentItemHeader,
    ContentItemBody,
    ContentItemGrid,
    ContentItemTitle,
    ContentItemSubtitle,
    ContentItemDescription,
    RowWrapper,
    FirstPartWrapper,
    FooterIcon,
    FooterText,
    Value,
    SecondPartWrapper,
    ScrollWrapper,
} from './Elements';
import { SkeletonCard } from '../../../../Loader/SkeletonCard';
import { truncateText } from '../../../../../utils/Text';

interface Props {
    clickedOrg: Feature<Point, any> | null;
    isLoading: boolean | undefined;
    isOpen: boolean;
}

export const OrganizationItem = memo(
    forwardRef<HTMLDivElement, Props>(
        ({
            isOpen,
            clickedOrg,
            isLoading,
        },  scrollRef) => {

            /* local render helpers */
            const rType = (t?: string) =>
                t ? (
                    <RowWrapper>
                        <FirstPartWrapper>
                            <FooterIcon src='/img/vector/RisingRoutes/cards/type.svg' alt='' />
                        </FirstPartWrapper>
                        <SecondPartWrapper>
                            <FooterText>Type of Organization</FooterText>
                            <Value>{truncateText({ text: t, maxLength: 80 })}</Value>
                        </SecondPartWrapper>
                    </RowWrapper>
                ) : null;

            const rAddress = (pr: any) => {
                const { address, city, state, zip_code } = pr || {};
                if (!address || !city || !state || !zip_code) return null;
                return (
                    <RowWrapper>
                        <FirstPartWrapper>
                            <FooterIcon src='/img/vector/RisingRoutes/cards/address.svg' alt='' />
                        </FirstPartWrapper>
                        <SecondPartWrapper>
                            <FooterText>Address</FooterText>
                            <Value>{truncateText({ text: [address, city, state, zip_code].join(', '), maxLength: 200 })}</Value>
                        </SecondPartWrapper>
                    </RowWrapper>
                );
            };

            const rMission = (m?: string) =>
                m ? (
                    <>
                        <ContentItemSubtitle>Mission</ContentItemSubtitle>
                        <ContentItemDescription>{truncateText({ text: m, maxLength: 800 })}</ContentItemDescription>
                    </>
                ) : null;

            const rAmount = (amount?: number) =>
                amount ? (
                    <RowWrapper>
                        <FirstPartWrapper>
                            <FooterIcon src='/img/vector/RisingRoutes/cards/amount.svg' alt='' />
                        </FirstPartWrapper>
                        <SecondPartWrapper>
                            <FooterText>Amount Requested</FooterText>
                            <Value>${amount.toLocaleString()}</Value>
                        </SecondPartWrapper>
                    </RowWrapper>
                ) : null;

            const rOAmount = (amount?: number) =>
                amount ? (
                    <RowWrapper>
                        <FirstPartWrapper>
                            <FooterIcon src='/img/vector/RisingRoutes/cards/revenue.svg' alt='' />
                        </FirstPartWrapper>
                        <SecondPartWrapper>
                            <FooterText>Oega Amount</FooterText>
                            <Value>${amount.toLocaleString()}</Value>
                        </SecondPartWrapper>
                    </RowWrapper>
                ) : null;

            /* Render */
            const item = useMemo(() => {
                if (isLoading && !clickedOrg)
                    return (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    );
                if (!clickedOrg) return null;

                return (
                    <ContentItemContainer key={clickedOrg.id} data-id={clickedOrg.id}>
                        <ContentItem>
                            <ContentItemHeader>
                                <ContentItemTitle>
                                    {isOpen
                                        ? clickedOrg?.properties?.organization_name
                                        : truncateText({ text: clickedOrg?.properties?.organization_name ?? '', maxLength: 39 })}
                                </ContentItemTitle>
                            </ContentItemHeader>
                            <ScrollWrapper 
                                ref={scrollRef} 
                                $isOpen={isOpen}>
                                <ContentItemGrid>
                                    {rType(clickedOrg.properties?.organization_type)}
                                    {rAddress(clickedOrg.properties)}
                                    {rAmount(clickedOrg.properties?.amount_requested)}
                                    {rOAmount(clickedOrg.properties?.oega_amount)}
                                </ContentItemGrid>
                                <ContentItemBody $isOpen={isOpen}>
                                    {rMission(clickedOrg.properties?.mission)}
                                </ContentItemBody>
                            </ScrollWrapper>
                        </ContentItem>
                    </ContentItemContainer>
                );
            }, [isLoading, 
                clickedOrg, 
                isOpen, 
                scrollRef]);

            return item;
        }
    )
);

OrganizationItem.displayName = 'OrganizationItem';
