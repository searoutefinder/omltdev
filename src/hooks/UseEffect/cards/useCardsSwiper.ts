import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/* -------------------------------------------------- helpers */
const throttle = (fn: () => void, delay = 100) => {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn();
    }
  };
};

type Dir = 'next' | 'prev';

/* -------------------------------------------------- hook */
export const useCardSwiper = (
  wrapperRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  gap: number,
  step: number,
  isIOS: boolean,  // iOS has a different scroll behavior         
) => {
  /* state / refs */
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [isLocked, setLocked] = useState(false);

  const currentIndex = useRef(0);
  const strideRef = useRef(0);

  /* -------------------------------------------------- misc utils */
  const THRESHOLD = gap / 2;

  const measureStride = useCallback((el: HTMLElement) => {
    const first = el.querySelector<HTMLElement>('[data-card]');
    if (!first) return 0;
    const style = getComputedStyle(first);
    const gapPx = parseFloat(style.marginRight) || gap;
    return first.getBoundingClientRect().width + gapPx;
  }, [gap]);

  /* -------------------------------------------------- arrows */
  const updateArrows = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (strideRef.current === 0) strideRef.current = measureStride(el);
    const stride = strideRef.current || 1;
    currentIndex.current = Math.round(el.scrollLeft / stride);

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;
    setCanLeft(scrollLeft > THRESHOLD);
    setCanRight(scrollLeft < maxScrollLeft - THRESHOLD);
  }, [wrapperRef,
    THRESHOLD,
    measureStride]);

  const throttledUpdate = useMemo(
    () => throttle(updateArrows, 100),
    [updateArrows]
  );

  /* -------------------- arrow click */
  const scrollByCard = useCallback(
    (dir: Dir) => {
      const el = wrapperRef.current;
      if (!enabled || !el || isLocked) return;

      if (strideRef.current === 0) strideRef.current = measureStride(el);
      const stride = strideRef.current || 1;

      if (isIOS) {
        currentIndex.current = Math.max(
          0,
          dir === 'next'
            ? currentIndex.current + step
            : currentIndex.current - step
        );
        const target = currentIndex.current * stride;

        el.scrollTo({ left: target, behavior: 'smooth' });

        setTimeout(() => {
          el.scrollTo({ left: target, behavior: 'auto' });
          updateArrows();
        }, 350);
      } else {
         const amount = stride * step;
         el.scrollBy({
          left: dir === 'next' ? amount : -amount,
          behavior: 'smooth',
        });
          setTimeout(updateArrows, 250);    
      }


    },
    [isIOS,
      enabled,
      isLocked,
      step,
      wrapperRef,
      measureStride,
      updateArrows
    ]
  );

  /* -------------------- listeners */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!enabled || !el) return;

    /* lock swipe-prevent areas */
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('[data-noswipe]')) setLocked(true);
    };
    const up = () => setLocked(false);

    el.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });

    updateArrows();                                // init
    el.addEventListener('scroll', throttledUpdate, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.removeEventListener('scroll', throttledUpdate);
    };
  }, [enabled,
    wrapperRef,
    throttledUpdate,
    updateArrows,]);

  useEffect(() => {
    strideRef.current = 0;
    currentIndex.current = 0;
    updateArrows();
  }, [gap, step, updateArrows]);

  /* ----------------- api */
  return {
    canLeft,
    canRight,
    scrollByCard,
    refresh: updateArrows,
  };
};
