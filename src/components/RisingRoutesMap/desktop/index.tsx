//libs
import { useRef, useEffect, useState, useMemo, useTransition, useDeferredValue } from "react";
import mapboxgl from 'mapbox-gl';
//types 
import { FeatureCollection, Feature, Point } from "geojson";//data 
import { FiltersOptionsType, FiltersType, RisingRoutesProps } from "../../../types/rising-routes";
//basemaps
import { basemapsRisingRoutes } from "../../Basemaps/configs";
//context 
//css 
import 'mapbox-gl/dist/mapbox-gl.css';
import LoaderSpinner from "../../Loader/SpinnerArrow";
import {BrandIcon} from '../components/TopBar/Elements';
//styles
import { LeftSidebar } from '../../SearchBar/mobile/Elements';
import { Container, MapContainer, MapCanvas, FiltersModal, ShadowOverlay } from './Elements';
//fncs
import TopBar from "../components/TopBar";
import { SearchBar } from "../../SearchBar/desktop";
import { FiltersBar } from "../components/Filters";
//hooks
import { useDataFetcher } from "../../../hooks/UseEffect/rising-routes/useDataFetcher";
import { useAddSourceAndLayers } from "../../../hooks/UseEffect/rising-routes/useAddSourceAndLayers";
import { useMapEvents } from "../../../hooks/UseEffect/rising-routes/useMapEvents";
import { useAutoScrollIntoView } from "../../../hooks/UseEffect/useAutoScrollIntoView";
import { useBounceMarker } from "../../../hooks/UseEffect/rising-routes/useBounceMarker";
import { useFilterWorker } from "../../../hooks/UseEffect/web-workers/useFilterWorker";
import { usePopupCleanup } from "../../../hooks/UseEffect/rising-routes/usePopupCleanup";
import { usePopupCustomClass } from "../../../hooks/UseEffect/rising-routes/usePopupCustomClass";


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN_RISING_ROUTES || '';


const RisingRoutes = ({
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

    //left panel 
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [openFiltersModal, setOpenFiltersModal] = useState<boolean>(false);

    //map 
    const [mapStyle] = useState<string>(basemapsRisingRoutes[0]);
    const [styleLoaded, setStyleLoaded] = useState<boolean>(false);

    //data
    const [features, setFeatures] = useState<FeatureCollection<Point> | null>(null);
    const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);

    //ids
    const idLookupRef = useRef<Record<number, Feature<Point>>>({});
    const [filteredIds, setFilteredIds] = useState<number[]>([]);

    //filters
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

    //transitions
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isFiltering, setIsFiltering] = useState<boolean>(true);
    const [isPending, startTransition] = useTransition();

    //optimization
    const deferredIds = useDeferredValue(filteredIds);

    //init map
    useEffect(() => {
        if (mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [-105.5059, 39.1430483],
                zoom:7,
                pitch: 0,
                bearing: 0,
                maxZoom: 18,
                minZoom: 5,
                maxPitch: 70,
                attributionControl: false,
                respectPrefersReducedMotion: true,
                dragRotate: false,

            });


            // //set map bounds - COLORADO STATE    
            // map.current.setMaxBounds(
            //     [-109.060253,   //min x 
            //         35.592424,  //min y
            //     -102.041524,    //max x
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
        idLookupRef,
        setIsFetching,
        onData: setFeatures
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
        selectedId: selectedFeatureId,
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

    //END OF HOOKS ----------------------------------------------

    
    //HELPERS - for transitions
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


    //OPTIMIZATIONS --------------------------------------------
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

    // console.log('features', features);
    // console.log(openFiltersModal);
    // console.log('transitions or fetching', isFetching);
    // console.log(memoizedOrgTypeOptions);
    // console.log('render')
    // console.log(idLookupRef.current);
    // console.log('isFetching', isFetching);
    // console.log('isFiltering', isFiltering);
    return (
        <Container ref={mapCanvas}>
            <ShadowOverlay $isModalOpen={openFiltersModal} onClick={() => setOpenFiltersModal(false)} />
            <TopBar 
              webMapName= 'Title goes here'/>
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
                    }}
                />
            </MapCanvas>
            <LeftSidebar>
                <SearchBar
                    //layout
                    mapInstance={map.current}
                    popupRef={popupRef}
                    itemsWrapperRef={itemsWrapperRef}
                    isMobile={isMobile}
                    query={query}
                    //transitions
                    styleLoaded={styleLoaded}
                    isOpen={isOpen}
                    isLoading={isLoading}
                    //data
                    activeFilterCount={activeFilterCount}
                    filteredOrganizations={deferredIds.map(id => idLookupRef.current[id])}
                    selectedFeatureId={selectedFeatureId}
                    //selections
                    selectedState={filters.selectedState}
                    selectedCity={filters.selectedCity}
                    //callbacks 
                    clearAllFilters={handleClearAllFilters}
                    setIsOpen={setIsOpen}
                    setQuery={setQuery}
                    setIsFetching={setIsFetching}
                    setSelectedFeatureId={setSelectedFeatureId}
                    setOpenFiltersModal={setOpenFiltersModal}
                    clearAll={handleClearAllFilters}
                />
               
            </LeftSidebar>
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

        </Container>
    );

};

export default RisingRoutes;