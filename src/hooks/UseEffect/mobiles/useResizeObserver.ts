import { useState, useEffect, RefObject } from 'react';

interface ObserverProps {
  ref: RefObject<HTMLElement | null>;
  width: number; // min card width u px
  gap: number;   // gap between cards in px
}

export function useResizeObserver({
  ref,
  width: cardWidth,
  gap,
}: ObserverProps): number {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calculate = (containerWidth: number) => {
      const possible = Math.floor((containerWidth + gap) / (cardWidth + gap));
      setSlidesPerView(Math.max(1, possible));
    };

    // init calculate
    calculate(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        calculate(entry.contentRect.width);
      }
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [ref, cardWidth, gap]);
  // console.log('slidesPerView', slidesPerView);
  return slidesPerView;
}
