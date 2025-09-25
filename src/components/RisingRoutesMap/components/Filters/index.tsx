import React, { memo, useState, MouseEvent, useRef } from 'react';
import {
    Panel,
    Header,
    Title,
    CloseIcon,
    Body,
    Section,
    Accordion,
    AccordionHeader,
    HeaderText,
    Chevron,
    OptionsList,
    OptionRow,
    SectionTitle,
    OptionsGrid,
    Pill,
    Footer,
    ClearBtn,
    ApplyBtn,
    DotContainer,
    Dot
} from './Elements';


interface Props {
    //selections
    selectedOrgType: string;
    selectedState: string;
    selectedCity: string;
    //options
    orgTypeOptions: string[];
    stateOptions: string[];
    cityOptions: string[];
    resultsCount: number;
    //isUIBusy?: boolean;
    isBusy?: boolean;
    //callbacks
    setSelectedOrgType: (v: string) => void;
    setSelectedState: (v: string) => void;
    setSelectedCity: (v: string) => void;
    clearAll: () => void;
    apply: (e: MouseEvent<HTMLButtonElement | HTMLImageElement>) => void;
}

export const FiltersBar: React.FC<Props> = memo(
    ({
        selectedOrgType,
        selectedState,
        selectedCity,
        orgTypeOptions,
        stateOptions,
        cityOptions,
        resultsCount,
        isBusy,
        setSelectedOrgType,
        setSelectedState,
        setSelectedCity,
        clearAll,
        apply,
    }) => {


        // REFS----------------------------------------
        const scrollRefBody = useRef<HTMLDivElement | null>(null);

        // STATES----------------------------------------
        // for accordion open/close
        const [openStates, setOpenStates] = useState<boolean>(false);
        const [openCities, setOpenCities] = useState<boolean>(false);


        //#FIX -add correct references - helpers-----------------------------------------
        // const scrollToTop = (ref: RefObject<HTMLDivElement | null>) => {
        //     if (ref.current) {
        //         ref.current.scrollTo({
        //             top: 0,
        //             behavior: 'smooth'
        //         });
        //     }
        // };


        //jsx----------------------------------------
        const DotLoader = () => {
            return (
                <DotContainer>
                    <Dot $delay={0} />
                    <Dot $delay={0.2} />
                    <Dot $delay={0.4} />
                </DotContainer>
            );
        };

        return (
            <Panel>
                <Header>
                    <Title>Filters</Title>
                    <CloseIcon
                        src="/img/raster/RisingRoutes/cross.png"
                        onClick={apply}
                        alt="Close filters"
                        aria-label="close" />

                </Header>
                <Body ref={scrollRefBody}>

                    {/* ----- organization type ----- */}
                    <Section>
                        <SectionTitle>Organization type</SectionTitle>
                        <OptionsGrid>
                            <Pill
                                $active={selectedOrgType === ''}
                                $isBusy={isBusy}
                                onClick={() => setSelectedOrgType('')}
                            >
                                Any type
                            </Pill>
                            {orgTypeOptions.map((t) => (
                                <Pill
                                    key={t}
                                    $active={selectedOrgType === t}
                                    onClick={() => setSelectedOrgType(t)}
                                >
                                    {t}
                                </Pill>
                            ))}
                        </OptionsGrid>
                    </Section>

                    {/* ----- state  ----- */}
                    <Accordion
                        >
                        <AccordionHeader
                            $open={openStates}
                            onClick={() => {
                                setOpenStates(!openStates);
                                // scrollToTop(scrollRefBody); 
                            }
                            }
                        >
                            <HeaderText>State</HeaderText>
                            <Chevron $open={openStates} />
                        </AccordionHeader>

                        {openStates && (
                            <OptionsList
                                $open={openStates}>
                                <OptionRow
                                    $active={selectedState === ''}
                                    $isBusy={isBusy}
                                    onClick={() => {
                                        setSelectedState('');
                                        setSelectedCity('');
                                        setOpenCities(false);
                                    }}
                                >
                                    <span>All</span>
                                </OptionRow>

                                {stateOptions.map((s) => (
                                    <OptionRow
                                        key={s}
                                        $active={selectedState === s}
                                        onClick={() => {
                                            setSelectedState(s);
                                            setSelectedCity('');
                                            setOpenCities(true);
                                            setOpenStates(false);
                                        }}
                                    >
                                        <span>{s}</span>
                                    </OptionRow>
                                ))}
                            </OptionsList>
                        )}
                    </Accordion>

                    {selectedState && (
                        <Accordion>
                            <AccordionHeader
                                $open={openCities}
                                onClick={() => {
                                    setOpenCities(!openCities);
                                    // scrollToTop(scrollRefBody); 
                                }
                                }
                            >
                                <HeaderText>City</HeaderText>
                                <Chevron $open={openCities} />
                            </AccordionHeader>

                            {openCities && (
                                <OptionsList
                                    $open={openCities}>
                                    <OptionRow
                                        $active={selectedCity === ''}
                                        $isBusy={isBusy}
                                        onClick={() => setSelectedCity('')}>
                                        <span>All </span>
                                    </OptionRow>

                                    {cityOptions.map((c) => (
                                        <OptionRow
                                            key={c}
                                            $active={selectedCity === c}
                                            $isBusy={isBusy}
                                            onClick={() => {
                                                setSelectedCity(c)
                                                setOpenCities(false);
                                            }
                                            }
                                        >
                                            <span>{c}</span>
                                        </OptionRow>
                                    ))}
                                </OptionsList>
                            )}
                        </Accordion>
                    )}


                </Body>
                {/* Footer */}
                <Footer>
                    <ClearBtn onClick={clearAll}>Clear all</ClearBtn>
                    {resultsCount === 0 ? (
                        <ApplyBtn disabled>
                            No organizations found
                        </ApplyBtn>
                    ) : (
                        <ApplyBtn onClick={apply} disabled={isBusy}>
                            {isBusy ? (
                                <DotLoader />
                            ) : (
                                `Show ${resultsCount} organizations`
                            )}
                        </ApplyBtn>
                    )}
                </Footer>
            </Panel>
        );
    }
);
FiltersBar.displayName = 'FiltersBar';
