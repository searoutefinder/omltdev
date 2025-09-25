import {
  useRef,
  useCallback,
  RefObject,
  useEffect,
  startTransition,
} from 'react';

/* ---------- props ---------- */
interface UseBottomSheetDragProps {
  open: boolean;                                   // sheet open?
  sheetRef:  RefObject<HTMLDivElement | null>;     // whole bottom-sheet
  scrollRef: RefObject<HTMLDivElement | null>;     // inner scroll area
  closedPct: number;                               // 0.80 → 80 % screen
  openPct:   number;                               // 0    → fully open
  setOpen:   (v: boolean) => void;                 
}

export function useBottomSheetDrag({
  open,
  sheetRef,
  scrollRef,
  closedPct,
  openPct,
  setOpen,
}: UseBottomSheetDragProps) {

  /* ---------- refs ---------- */
  const startY        = useRef(0);
  const startPct      = useRef(0);
  const lastDeltaPct  = useRef(0);
  const dragging      = useRef(false);
  const atTopOnStart  = useRef(false);             // was list at top on pointer-down?

  /* ---------- const ---------- */
  const DEADZONE      = 6;                         // px before we decide
  const SNAP_THRESH   = 1;                         // px to snap open / closed

  /* ---------- move ---------- */
  const onMove = useCallback((e: PointerEvent) => {
    if (!sheetRef.current) return;
    
    const deltaPx = e.clientY - startY.current;
    
    /*gesture not committed yet */
    if (!dragging.current) {
      if (Math.abs(deltaPx) < DEADZONE) return;

      const movingDown = deltaPx > 0;
      const movingUp   = deltaPx < 0;

      // sheet OPEN -> capture swipe-down only if list started at top
      if ( open  && atTopOnStart.current && movingDown) {
        sheetRef.current.setPointerCapture(e.pointerId);
        dragging.current = true;
      }

      // sheet CLOSED → capture first swipe-up everywhere
      else if (!open && movingUp) {
        sheetRef.current.setPointerCapture(e.pointerId);
        dragging.current = true;
      }
      // otherwise let browser handle scroll
      else {
        window.removeEventListener('pointermove',   onMove);
        window.removeEventListener('pointerup',     onUp);
        window.removeEventListener('pointercancel', onUp);
        return;
      }
    }

    /* drag mode */
    e.preventDefault();

    // if more than 1% of screen height->
    const deltaPct = (deltaPx / window.innerHeight) * 100;
    lastDeltaPct.current = deltaPct;

    let pct = startPct.current + deltaPct;
    pct = Math.min(closedPct * 100, Math.max(openPct * 100, pct));

    sheetRef.current.style.transition = 'none';
    sheetRef.current.style.transform  = `translateY(${pct}%)`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    sheetRef,
    scrollRef,
    closedPct,
    openPct,
  ]);

  /* ---------- up / cancel ---------- */
  const onUp = useCallback((e: PointerEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    e.preventDefault();
    dragging.current = false;

    const wantOpen = open
      ? lastDeltaPct.current <  SNAP_THRESH   // we were closing
      : lastDeltaPct.current < -SNAP_THRESH;  // we were opening
     
    sheetRef.current.style.transition =
      'transform 0.25s cubic-bezier(0.4,0,0.2,1)';
    sheetRef.current.style.transform = '';

    startTransition(() => 
      setOpen(wantOpen)
   );

    try { sheetRef.current.releasePointerCapture(e.pointerId); } catch {
      // ignore if pointer was already released
      // (i.e. if user moved pointer outside of sheet)
    }

    window.removeEventListener('pointermove',   onMove);
    window.removeEventListener('pointerup',     onUp);
    window.removeEventListener('pointercancel', onUp);

  }, [
    open,
    sheetRef,
    setOpen,
    onMove,
  ]);

  /* ---------- pointer-down ---------- */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!sheetRef.current) return;

    startY.current       = e.clientY;
    startPct.current     = open ? 0 : closedPct * 100;
    lastDeltaPct.current = 0;
    dragging.current     = false;

    // remember if it was already at top
    atTopOnStart.current =
      !scrollRef.current || scrollRef.current.scrollTop <= 0;

    window.addEventListener('pointermove',   onMove, { passive: false });
    window.addEventListener('pointerup',     onUp,   { passive: false });
    window.addEventListener('pointercancel', onUp,   { passive: false });

  }, [
      open,
      closedPct,
      sheetRef,
      scrollRef,
      onMove,
      onUp,
  ]);

  /* ---------- unmount cleanup ---------- */
  useEffect(() => () => {
    window.removeEventListener('pointermove',   onMove);
    window.removeEventListener('pointerup',     onUp);
    window.removeEventListener('pointercancel', onUp);
  }, [
    onMove,
    onUp,
  ]);

  return { onPointerDown };
}
