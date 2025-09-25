import React, { 
    MouseEvent,
    memo } from 'react';
import {
  ResultsContainer,
  ResultItem,
  LocationPointer,
  ResultsTextWrapper,
  ResultText,
  ResultDescription,
} from './Elements';           
import { highlightMatch } from '../../../../utils/SearchBar';

interface Props {
  results: any[];
  query: string;
  isOpen: boolean;
  selectedFeatureId: number | null;
  onSelect: (e: MouseEvent<HTMLDivElement>, f: any) => void;
}

export const ResultsDropdown: React.FC<Props> = memo(
  ({ results, 
     query, 
     isOpen, 
     selectedFeatureId, 
     onSelect }) => {
    
    const isHidden = results.length === 0;
    const isLarger = results.length > 2;  // controls height

    return (
      <ResultsContainer $isHidden={isHidden} $isOpen={isOpen} $isLarger={isLarger}>
        {results.map((r) => (
          <ResultItem
            key={r.id}
            $selected={selectedFeatureId === r.id}
            onClick={(e) => onSelect(e, r)}
          >
            <LocationPointer src="/img/raster/RisingRoutes/marker.png" alt="" />
            <ResultsTextWrapper>
              <ResultText>{highlightMatch(r.properties.organization_name, query)}</ResultText>
              <ResultDescription>
                {r.properties.Address} {r.properties.city}, {r.properties.state},{' '}
                {r.properties.zip_code}
              </ResultDescription>
            </ResultsTextWrapper>
          </ResultItem>
        ))}
      </ResultsContainer>
    );
  }
);
ResultsDropdown.displayName = 'ResultsDropdown';
