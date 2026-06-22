import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initPageEffects } from '../lib/siteInit';

export function usePageEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cleanup = () => {};

    const frame = requestAnimationFrame(() => {
      cleanup = initPageEffects(pathname);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [pathname]);
}
