import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Container, Arrow, InfoModalContent, InfoModalItemTitleWrapper, InfoModalItemTitle, InfoModalItemText, InfoModalItem, ReadMore, GreenArrow, InfoModalFooter, CloseModal, ContentWrraper } from './Elements';

interface InfoModalProps {
    isMobile: boolean;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

//#fix api fetch ? 
const data = [
    {
        id: 1,
        title: "Fee-Owned Lands",
        content: "Properties that a land trust owns outright, giving them full control over management, conservation, and public access decisions."
    },
    {
        id: 2,
        title: "Easements",
        content: "Legal agreements that permanently restrict development and land use to protect conservation values, while ownership remains with the private landowner."
    },
    {
        id: 3,
        title: "State Transfers",
        content: "The process by which land is transferred from a land trust to a state agency, typically to incorporate it into public lands for long-term conservation and management."
    },
]

export const InfoModal = ({ isMobile, isOpen, setIsOpen }: InfoModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null);
    const [expandedserviceNames, setExpandedserviceNames] = useState<number[]>([]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setExpandedserviceNames([]);
        }
    }, [setIsOpen]);

    //close modal on click outside
    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside, isOpen]);


    //expand all items on mobile
    useEffect(() => {
        if (isMobile && isOpen) {
            setExpandedserviceNames(data.map(item => item.id));
        } else {
            setExpandedserviceNames([]);
        }
    }, [isMobile, isOpen]);


    //fnc for jsx 
    const handleReadMoreClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
        setExpandedserviceNames(prevIds => {
            if (isMobile) {
                return prevIds.includes(id) ? prevIds.filter(serviceName => serviceName !== id) : [...prevIds, id];
            } else {
                return prevIds.includes(id) ? [] : [id];
            }
        });
        e.stopPropagation();
    };

    return (
        <Container $isOpen={isOpen}>
            <Arrow src={'img/vector/LeftSidebar/infoModalArrow.svg'} />
            <ContentWrraper>
                <InfoModalContent ref={modalRef} $expandedserviceName={expandedserviceNames.length}>
                    {data.map((item) => (
                        <InfoModalItem
                            key={item.id}
                            $isExpanded={expandedserviceNames.includes(item.id)}
                        >
                            <InfoModalItemTitleWrapper>
                                <InfoModalItemTitle>{item.title}</InfoModalItemTitle>
                                <ReadMore onClick={(e) => handleReadMoreClick(e, item.id)}>
                                    Read More
                                    <GreenArrow $isExpanded={!expandedserviceNames.includes(item.id)} src={'/img/vector/LeftSidebar/rightGreenArrow.svg'} />
                                </ReadMore>
                            </InfoModalItemTitleWrapper>
                            {expandedserviceNames.includes(item.id) && <InfoModalItemText>{item.content}</InfoModalItemText>}
                        </InfoModalItem>
                    ))}
                </InfoModalContent>
                <InfoModalFooter>
                    <CloseModal onClick={() => setIsOpen(false)}>Close</CloseModal>
                </InfoModalFooter>
            </ContentWrraper>
        </Container>
    );
}
