import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function revealIfVisible(el) {
  const rect = el.getBoundingClientRect();
  const inViewport = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  if (inViewport) {
    el.classList.add('in-view');
    return true;
  }
  return false;
}

export function useScrollAnimations() {
  const { pathname } = useLocation();

  useEffect(() => {
    let observer;

    const init = () => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');

      if (!animatedElements.length) return;

      if (!('IntersectionObserver' in window)) {
        animatedElements.forEach((el) => el.classList.add('in-view'));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
      );

      animatedElements.forEach((el) => {
        if (!revealIfVisible(el)) {
          observer.observe(el);
        }
      });
    };

    // Run after the new route content has painted.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(init);
    });

    const safetyTimer = window.setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll:not(.in-view)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.1 && rect.bottom > 0) {
          el.classList.add('in-view');
        }
      });
    }, 400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(safetyTimer);
      observer?.disconnect();
    };
  }, [pathname]);
}
