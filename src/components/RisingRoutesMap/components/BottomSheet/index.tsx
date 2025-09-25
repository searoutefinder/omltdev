import React, {
  useRef,
  RefObject, 
} from 'react';
import {
  BottomSheetContainer,
  BottomSheetHandle,
  BottomSheetContent,
} from './Elements';
import { Feature, Point } from 'geojson';
import { useBottomSheetDrag } from '../../../../hooks/UseEffect/rising-routes/useBottomSheetDrag';
import { OrganizationItem } from '../Items/mobile/index';

interface BottomSheetProps {
  isOpen: boolean;
  memoizedOrg: Feature<Point, any> | null;
  isLoading: boolean;
  selectedFeatureId?: number | null;
  itemsWrapperRef: RefObject<HTMLDivElement | null>;
  setIsOpen: (isOpen: boolean) => void;
}

export const BottomSheet = (
  { isOpen,
    memoizedOrg,
    isLoading,
    setIsOpen,
  }: BottomSheetProps) => {

  //refs
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

 
  const { onPointerDown } = useBottomSheetDrag({
    open: isOpen,
    sheetRef: sheetRef,
    scrollRef: scrollRef, 
    closedPct: 0.80,
    openPct: 0,
    setOpen: setIsOpen,
  })


  return (
    <BottomSheetContainer
      ref={sheetRef}
      $open={isOpen}
      $isSelected={!!memoizedOrg}
      onPointerDown={onPointerDown}>
      <BottomSheetHandle />
      <BottomSheetContent 
        >
        <OrganizationItem
          ref={scrollRef}
          clickedOrg={memoizedOrg}
          isLoading={isLoading}
          isOpen={isOpen}
        />
      </BottomSheetContent>
    </BottomSheetContainer>
  );
};
