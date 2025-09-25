import React, { useState, useEffect, MouseEvent, useRef, useMemo, useCallback, RefObject, startTransition } from 'react';
import {
  SearchBarContainer,
  Input,
  SearchIcon,
  ClearInputButton,
  InputContainer,
} from './Elements';
import { Feature, Point } from 'geojson';

//JS Imports
import { OrganizationList } from '../../RisingRoutesMap/components/Items/desktop/index';
import { ResultsDropdown } from '../../RisingRoutesMap/components/Results/index';

//---------------UTILS ---------------------
import { fetchSearchResults } from '../../../constants/AGOL/rising-routes/api';
import { zoomToPoint } from '../../../utils/Camera/zoomToPoint';
import { showPopup } from '../../../utils/RisingRoutes/index';


//---------------TYPES ---------------------
interface SearchBarProps {
  mapInstance: mapboxgl.Map | null;
  popupRef: React.MutableRefObject<mapboxgl.Popup | null>;
  isMobile: boolean;
  styleLoaded: boolean;
  query: string;
  isOpen: boolean;
  isLoading?: boolean;
  //data
  activeFilterCount: number;
  filteredOrganizations: Feature<Point, any>[];
  selectedFeatureId: number | null;
  itemsWrapperRef: RefObject<HTMLDivElement | null>;
  selectedState: string;
  selectedCity: string;
  //callbacks
  clearAllFilters: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setIsFetching: (fetching: boolean) => void;
  setSelectedFeatureId: (featureId: number | null) => void;
  setOpenFiltersModal: (open: boolean) => void;
  clearAll: () => void;
}


export const SearchBar = ({
  mapInstance,
  popupRef,
  isMobile,
  styleLoaded,
  query,
  isOpen,
  isLoading,
  //data
  activeFilterCount,
  filteredOrganizations,
  selectedFeatureId,
  itemsWrapperRef,
  //callbacks
  setIsOpen,
  setQuery,
  setIsFetching,
  setSelectedFeatureId,
  setOpenFiltersModal,
  clearAllFilters,
}: SearchBarProps) => {


  //refs-------------
  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //states-------------
  const [returned, setResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);



  // HELPER FUNCTIONS ------------------------------------------------------
  //1. handle Close Sidebar
  const handleClose = useCallback((e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setIsOpen(false);
  }, [setIsOpen]);

  //2. abort signal - cancel previous requests if user moved the map or changed the query
  const handleSearch = async () => {
    if (!query) return;

    //abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    };
    //create new abort controller for the new request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setResults([]);
    setIsFetching(true);

    try {
      const features = await fetchSearchResults(query, controller.signal);
      features.forEach((feature: any) => {
        if (!feature.properties) feature.properties = {};
        feature.properties.isSelected = false;
      });

      //add here searching by city and state
      setResults(features);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // console.log('Search request aborted:', error);
      } else {
        console.error('Error fetching search results:', error);
      }
    } finally {
      setIsFetching(false);
    };
  };


  //3. handle click on the result item to zoom to the location
  const handleResultClick = (e: MouseEvent<HTMLDivElement>, clickedFeature: any) => {
    e.preventDefault();
    const [lon, lat] = clickedFeature.geometry.coordinates;
    startTransition(() => {
      //1.zoom to clicked point
      zoomToPoint(mapInstance, [lon, lat], 15, isMobile, 250)
      //2. set selected feature id 
      setSelectedFeatureId(clickedFeature.id as number);
      //3. reset results
      setResults([]);
      //4. reset query
      setQuery('');
      //6. set isOpen to true if it is false
      if (!isOpen) setIsOpen(true);
    })

  };


  //4. handle click on the content item to zoom to the location
  const handleItemClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, clickedFeature: any) => {
      e.preventDefault();
      const [lon, lat] = clickedFeature.geometry.coordinates;
      startTransition(() => {
        //1. zoom to clicked point
        zoomToPoint(mapInstance, [lon, lat], 15, isMobile, 250)
        //2. set selected feature id 
        setSelectedFeatureId(clickedFeature.id as number);
        //3. reset results
        setResults([]);
        //4. show popup
        showPopup({
          mapInstance: mapInstance,
          popupRef: popupRef,
          feature: clickedFeature,
          isMobile: isMobile
        })
      })
    },
    [ 
      mapInstance,
      popupRef, 
      isMobile, 
      setSelectedFeatureId, 
      ]
  );



  //5. clear input and results
  const clearInput = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    startTransition(() => {
      setQuery('');
      setIsFetching(false);
    })
  };


  // HOOKS ---------------------------
  //1. handle search when query changes
  useEffect(() => {
    //debounce to reduce api calls
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        handleSearch();
      };
      if (query === '') {
        setResults([]);
      }
      setIsFetching(false);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsFetching(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);


  // 2. handle click outside of the search bar to close results
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setResults([]);
        setIsFocused(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setResults,
    containerRef]);


  //-------------OPTIMIZATION------------------- 

  //1. memoize returned data by search query
  const memoizedReturned = useMemo(() => returned,
    [returned]);

  const memoizedOrgs = useMemo(() => filteredOrganizations, [filteredOrganizations]);


  // console.log('SearchBar: returned', returned);
  // console.log('isFetching', isFetching);
  // console.log('render panel component');
  return (
    <SearchBarContainer
      $active={isFocused
        || query.length > 0}
    >
      {/* <ToggleButton >
       
      </ToggleButton>
         */}
      <InputContainer ref={containerRef}>
        <SearchIcon
          src={'/img/raster/RisingRoutes/search-symbol.png'}
          alt="search icon"
          onClick={handleSearch}
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search by organization, city, or address..."
          disabled={!styleLoaded}
        >
        </Input>
        <ClearInputButton
          onClick={e => clearInput(e)}
          $isHidden={query.length === 0}
          $isFetching={isLoading}>
          Clear
        </ClearInputButton>
      </InputContainer>

      { /* Render the results container with search results */}
      <ResultsDropdown
        results={memoizedReturned}
        query={query}
        isOpen={isOpen}
        selectedFeatureId={selectedFeatureId}
        onSelect={handleResultClick}
      />
      {/* Render the organization list component */}
      <OrganizationList
        organizations={memoizedOrgs}
        isLoading={isLoading}
        isOpen={isOpen}
        dropdownCount={memoizedReturned.length}
        selectedFeatureId={selectedFeatureId}
        itemsWrapperRef={itemsWrapperRef}
        activeFilterCount={activeFilterCount}
        setSelectedId={setSelectedFeatureId}
        clearAllFilters={clearAllFilters}
        setOpenFiltersModal={setOpenFiltersModal}
        onItemClick={handleItemClick}
        onClose={handleClose}
      />

    </SearchBarContainer>
  );
};

