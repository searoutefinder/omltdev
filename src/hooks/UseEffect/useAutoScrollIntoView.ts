import { useEffect, RefObject } from "react";

interface AutoScrollIntoViewProps {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  selectedId: number | null;
  behavior?: ScrollBehavior;
}

export function useAutoScrollIntoView({
  isOpen,
  containerRef,
  selectedId,
  behavior = "smooth",
}: AutoScrollIntoViewProps) {


useEffect(() => {
  if (!isOpen 
      || selectedId == null 
      || !containerRef.current) return;


    const id = setTimeout(() => {
    const container = containerRef.current!;
    const row = container.querySelector<HTMLElement>(`[data-id="${selectedId}"]`);
    if (!row) return;

    const offset = row.offsetTop - container.offsetTop;

    container.scrollTo({
      top: offset,        
      behavior,           
    });
  }, 520);                

  return () => clearTimeout(id);
}, [isOpen, 
    selectedId, 
    behavior, 
    containerRef]);
}
