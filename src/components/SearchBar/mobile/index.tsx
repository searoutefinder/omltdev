import React, {
  useEffect,
  MouseEvent,
  useRef,
  useMemo,
  RefObject,
  startTransition,
} from 'react';
import {
  SearchBarContainer,
  Input,
  SearchIcon,
  ClearInputButton,
  InputContainer,
  FilterBarContainer,
  FilterIcon
} from './Elements';
import { Feature, Point } from 'geojson';

//JS Imports
import { ResultsDropdown } from '../../RisingRoutesMap/components/Results/index';

//---------------UTILS ---------------------
import { fetchSearchResults } from '../../../constants/AGOL/rising-routes/api';
import { zoomToPoint } from '../../../utils/Camera/zoomToPoint';

interface SearchBarProps {
  mapInstance: mapboxgl.Map | null;
  popupRef?: React.MutableRefObject<mapboxgl.Popup | null>;
  isMobile: boolean;
  styleLoaded: boolean;
  query: string;
  isFocused: boolean;
  isOpen: boolean;
  isLoading?: boolean;
  //data
  selectedFeatureId: number | null;
  itemsWrapperRef: RefObject<HTMLDivElement | null>;
  returned: Feature<Point, any>[];
  activeFilterCount: number;
  //callbacks
  setIsFocused: (focused: boolean) => void;
  clearAllFilters: () => void;
  setResults: (results: Feature<Point, any>[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setIsFetching: (fetching: boolean) => void;
  setSelectedFeatureId: (featureId: number | null) => void;
  setOpenFiltersModal: (open: boolean) => void;
  clearAll: () => void;
}


export const SearchBar = ({
  mapInstance,
  isMobile,
  styleLoaded,
  query,
  isFocused,
  isOpen,
  isLoading,
  //data
  selectedFeatureId,
  returned,
  activeFilterCount,
  //callbacks
  setResults,
  setIsOpen,
  setQuery,
  setIsFetching,
  setSelectedFeatureId,
  setOpenFiltersModal,
  setIsFocused,
}: SearchBarProps) => {


  // console.log(isFetching, 'isFetching in SearchBar');

  //refs-------------
  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);





  // HELPER FUNCTIONS ------------------------------------------------------

  //1. abort signal - cancel previous requests if user moved the map or changed the query
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


  //2. handle click on the result item to zoom to the location
  const handleResultClick = (e: MouseEvent<HTMLDivElement>, clickedFeature: any) => {
    e.preventDefault();
    const [lon, lat] = clickedFeature.geometry.coordinates;
    //#start a transition to avoid blocking the UI
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


  //3. clear input and results
  const clearInput = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    startTransition(() => {
      setQuery('');
      setIsFetching(false);
    });

  };

  //4. handle click on the filters icon to open filters modal
  const handleOpenFiltersModal = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    startTransition(() => {
      setOpenFiltersModal(true);
    });
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
    containerRef, 
    setIsFocused]);


  //-------------OPTIMIZATION------------------- 

  //1. memoize returned data by search query
  const memoizedReturned = useMemo(() => returned,
    [returned]);

  // console.log('SearchBar: returned', returned);
  // console.log('isFetching', isFetching);
  // console.log('render panel component');
  return (
    <>
      <SearchBarContainer
        $active={isFocused
          || query.length > 0}
      >
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

      </SearchBarContainer>
      <FilterBarContainer
        onClick={(e) => handleOpenFiltersModal(e)}>
        <FilterIcon
          src='/img/raster/RisingRoutes/filter.png'
          alt='filter icon'
        />
        {/* //FIXME: add a class here */}
        {activeFilterCount > 0 && (
          <span className="filters-count"
            style={{
              display: 'flex',
              position: 'absolute',
              top: '-12px',
              right: '-9px',
              color: '#A7634E',
              backgroundColor: '#FCEDD8',
              padding: '3px 7px',
              zIndex: "-10",
              border: '1px solid #A7634E',
              borderRadius: "10px",
              fontSize: '14px',
              fontWeight: 600,
            }}>
            {activeFilterCount}
          </span>
        )}
      </FilterBarContainer>
    </>

  );
};

