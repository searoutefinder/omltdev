//libs
import { useRef, useEffect, useState, useMemo, useTransition, } from "react";
import mapboxgl from 'mapbox-gl';
//types 
import { FeatureCollection, Feature, Point } from "geojson";//data 
import { FiltersOptionsType, FiltersType, RisingRoutesProps } from "../../../types/rising-routes";
//basemaps
import { basemapsRisingRoutes } from "../../Basemaps/configs";
//css 
import 'mapbox-gl/dist/mapbox-gl.css';
import LoaderSpinner from "../../Loader/SpinnerArrow";
import { BrandIcon } from '../components/TopBar/Elements';
//styles
import { Container, MapContainer, MapCanvas, FiltersModal } from './Elements';
//fncs
import { SearchBar } from "../../SearchBar/mobile";
import { FiltersBar } from "../components/Filters";
import { BottomSheet } from "../components/BottomSheet";
//hooks
import { useDataFetcher } from "../../../hooks/UseEffect/rising-routes/useDataFetcher";
import { useAddSourceAndLayers } from "../../../hooks/UseEffect/rising-routes/useAddSourceAndLayers";
import { useMapEvents } from "../../../hooks/UseEffect/rising-routes/useMapEvents";
import { useAutoScrollIntoView } from "../../../hooks/UseEffect/useAutoScrollIntoView";
import { useBounceMarker } from "../../../hooks/UseEffect/rising-routes/useBounceMarker";
import { useFilterWorker } from "../../../hooks/UseEffect/web-workers/useFilterWorker";
import { usePopupCleanup } from "../../../hooks/UseEffect/rising-routes/usePopupCleanup";
import { usePopupCustomClass } from "../../../hooks/UseEffect/rising-routes/usePopupCustomClass";

//env
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN_RISING_ROUTES || '';


/**
 * RisingRoutesMobile component
 * This component renders the Rising Routes map for mobile devices.
 * It includes a search bar, filters, and a map with features.
 * 
 * @returns {JSX.Element} The rendered component.
 */

const RisingRoutesMobile = ({
    isMobile
}: RisingRoutesProps) => {

    //------------------REFS----------------------------
    //layout
    const mapCanvas = useRef<HTMLDivElement>(null);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const itemsWrapperRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);


    //------------------STATES----------------------------
    //search bar 
    const [query, setQuery] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [results, setResults] = useState<Feature<Point, any>[]>([]);
    //left panel 
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [openFiltersModal, setOpenFiltersModal] = useState<boolean>(false);


    //FILTERS ------------------------
    //#Note - move to context if it grows
    const [filterOptions, setFilterOptions] = useState<FiltersOptionsType>({
        orgTypeOptions: [],
        stateOptions: [],
        cityOptions: [],
    });

    const [filters, setFilters] = useState<FiltersType>({
        selectedOrgType: '',
        selectedState: '',
        selectedCity: '',
    });

    // DATA ------------------------

    //refs for ids
    const idLookupRef = useRef<Record<number, Feature<Point>>>({});
    const [filteredIds, setFilteredIds] = useState<number[]>([]);

    //map
    const [mapStyle] = useState<string>(basemapsRisingRoutes[0]);
    const [styleLoaded, setStyleLoaded] = useState<boolean>(false);

    //data
    const [features, setFeatures] = useState<FeatureCollection<Point> | null>(null);
    const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);

    //transitions
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isFiltering, setIsFiltering] = useState<boolean>(true);
    const [isPending, startTransition] = useTransition();

    //optimization
    // const deferredIds = useDeferredValue(filteredIds);


    //init map
    useEffect(() => {
        if (mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [-105.5059, 39.1430483],
                zoom: 6,
                pitch: 0,
                bearing: 0,
                maxZoom: 18,
                minZoom: 5,
                maxPitch: 70,
                attributionControl: false,
                respectPrefersReducedMotion: true,
                dragRotate: false,

            });


            //set map bounds - COLORADO
            // map.current.setMaxBounds(
            //     [-109.060253, //min x 
            //         35.592424,  //min y
            //     -102.041524, //max x
            //         42.003444]  //max y
            // );


            // set styleLoaded to true 
            map.current.on('load', () => {
                setStyleLoaded(true);
                if (map.current && map.current.getTerrain()) {
                    map.current.setTerrain(null);
                }
            });
        }
        return () => {
            if (map.current) {
                map.current.remove();
                setStyleLoaded(false);
            }
        };
    }, [isMobile,
        mapStyle]);

    // -----------------HOOKS----------------------------------

    //1. dynamic? data fetcher 
    useDataFetcher({
        styleLoaded,
        setIsFetching,
        onData: setFeatures,
        idLookupRef: idLookupRef,
    });


    //2. useFilterWorker
    useFilterWorker({
        features: features,
        filters: filters,
        setFilteredIds: setFilteredIds,
        setFilterOptions: setFilterOptions,
        setFilters: setFilters,
        setIsFiltering: setIsFiltering,
    });


    //3. update map source and layer
    useAddSourceAndLayers({
        mapInstance: map.current,
        styleLoaded: styleLoaded,
        data: features,
        filterIds: filteredIds,
        selectedFeatureId: selectedFeatureId,
        sourceId: 'nearby-features-source',
        layerId: 'nearby-features',
    });



    // 4. bounce marker
    useBounceMarker({
        mapInstance: map.current,
        popupRef: popupRef,
        data: features,
        selectedFeatureId,
        isMobile: isMobile,
        filteredIds: filteredIds,
        setSelectedId: setSelectedFeatureId,
    });



    //5. popup on click
    useMapEvents({
        mapInstance: map.current,
        styleLoaded: styleLoaded,
        isMobile: isMobile,
        sourceId: 'nearby-features-source',
        layerId: 'nearby-features',
        layerId2: 'clusters',
        layerId3: 'cluster-count',
        popupRef: popupRef,
        setSelectedFeatureId: setSelectedFeatureId,
        setIsOpen: setIsOpen,
    });


    //6. popups cleanup
    usePopupCleanup({
        styleLoaded: styleLoaded,
        popupRef: popupRef,
        selectedId: selectedFeatureId
    });


    //7. autoScroll
    useAutoScrollIntoView({
        isOpen: true,
        containerRef: itemsWrapperRef,
        selectedId: selectedFeatureId,
    });


    //8. custom popup class
    usePopupCustomClass({
        mapInstance: map,
        popupRef: popupRef,
        className: 'risingRoutes',
    });

    //9. //hook for centering selected point (+popup div) within the remaining space 



    //10. close bottom sheet on click outside
    //11. close bottom sheet if open when search bar is in focus
    useEffect(() => {
        if (isOpen && isFocused) {
            startTransition(() => {
                setIsOpen(false);
            })
        }
    }, [isOpen,
        isFocused,
    ]);



    //END OF HOOKS ----------------------------------------------


    //HELPERS --------------------------------------------------
    const handleSetFilters = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
        //return if the value is the same
        if (filters[key] === value) return;
        startTransition(() => {
            setIsFiltering(true);
            setFilters(prev => {
                const next = { ...prev, [key]: value };
                if (key === 'selectedState') {
                    next.selectedCity = ''
                }
                return next;
            });
        });
    };

    //clear all filters with transition
    const handleClearAllFilters = () => {
        if (activeFilterCount === 0) return;
        startTransition(() => {
            setIsFiltering(true);
            setFilters({
                selectedOrgType: '',
                selectedState: '',
                selectedCity: '',
            });
            setOpenFiltersModal(false);
        });
    };


    const isLoading = useMemo(() => {
        return isFetching
            || isPending
            || idLookupRef === null
            || !styleLoaded
            || isFiltering
    }, [isFetching,
        isPending,
        styleLoaded,
        isFiltering]);


    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(value => value !== '').length;
    }, [filters]);

    const LoaderRender = useMemo(() => (
        <LoaderSpinner
            risingRoutes={true}
            isMobile={isMobile}
            styleLoaded={styleLoaded}
            isFetching={isFetching || isFiltering}
            leftPanelOpen={isOpen} />
    ), [isMobile,
        styleLoaded,
        isFetching,
        isFiltering,
        isOpen]);


    const clickedOrg = useMemo(() => {
        if (selectedFeatureId === null
            || !features
        ) return null;

        // do not add new one if it is same as previous
        if (idLookupRef.current[selectedFeatureId]) {
            return idLookupRef.current[selectedFeatureId];
        };
        //#FIX - redundant code - same on two places - debounce marker hook and here: 
        //create hook and add transition state isLoading or isFiltering
        //1.find the feature with geometry and type Point    
        const clickedFeat = features.features.find(f => f.id === selectedFeatureId);
        if (!clickedFeat) return null;
        if (!isOpen) {
            startTransition(() => {
                setIsOpen(true);
            })
        }
        return clickedFeat;

    }, [isOpen,
        selectedFeatureId,
        features]);



    return (
        <Container ref={mapCanvas}>
            <MapCanvas>
                <MapContainer ref={mapContainer} id="map-container" />
                {LoaderRender}
                <BrandIcon
                    src="/img/raster/RisingRoutes/ggm-logo.png"
                    alt="Brand Icon"
                    onClick={() => {
                        if (window.top) {
                            window.top.location.href = 'https://www.greengoatmaps.com/';
                        }
                    }} />
                <SearchBar
                    //layout
                    mapInstance={map.current}
                    isMobile={isMobile}
                    isFocused={isFocused}
                    //search
                    query={query}
                    //transitions
                    styleLoaded={styleLoaded}
                    isOpen={isOpen}
                    isLoading={isLoading}
                    //data
                    selectedFeatureId={selectedFeatureId}
                    itemsWrapperRef={itemsWrapperRef}
                    //selections
                    returned={results}
                    activeFilterCount={activeFilterCount}
                    //callbacks 
                    setIsFocused={setIsFocused}
                    clearAllFilters={handleClearAllFilters}
                    setResults={setResults}
                    setIsOpen={setIsOpen}
                    setQuery={setQuery}
                    setIsFetching={setIsFetching}
                    setSelectedFeatureId={setSelectedFeatureId}
                    setOpenFiltersModal={setOpenFiltersModal}
                    clearAll={handleClearAllFilters}
                />
            </MapCanvas>
            <FiltersModal
                $isOpen={openFiltersModal}>
                <FiltersBar
                    //selections
                    selectedOrgType={filters.selectedOrgType}
                    selectedState={filters.selectedState}
                    selectedCity={filters.selectedCity}
                    //options
                    orgTypeOptions={filterOptions.orgTypeOptions}
                    stateOptions={filterOptions.stateOptions}
                    cityOptions={filterOptions.cityOptions}
                    //isUIBusy
                    isBusy={isLoading}
                    //callbacks
                    setSelectedOrgType={(value: string) => handleSetFilters('selectedOrgType', value)}
                    setSelectedState={(value: string) => handleSetFilters('selectedState', value)}
                    setSelectedCity={(value: string) => handleSetFilters('selectedCity', value)}
                    clearAll={handleClearAllFilters}
                    apply={() => setOpenFiltersModal(false)}
                    resultsCount={filteredIds.length}
                />
            </FiltersModal>
            <BottomSheet
                isOpen={isOpen}
                memoizedOrg={clickedOrg}
                isLoading={isLoading}
                itemsWrapperRef={itemsWrapperRef}
                setIsOpen={setIsOpen}
            ></BottomSheet>
        </Container>
    );

};

export default RisingRoutesMobile;