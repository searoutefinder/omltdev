import { useEffect, useState, RefObject } from 'react';

export function useOverflow(
  ref: RefObject<HTMLElement | null>,
  ready = true     
) {
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || el===null || !ready) return;
   
    const check = () =>
      setOverflow(el.scrollHeight > el.clientHeight);

    check();                       

    const ro = new ResizeObserver(check);
    ro.observe(el);

    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [ref, ready]);                 

  return overflow;
}
