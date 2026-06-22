import { useEffect } from 'react';
import VirtualTourContent, { bodyClass } from './content/VirtualTourContent';

export default function VirtualTourPage() {
  useEffect(() => {
    document.body.className = bodyClass;

    const iframe = document.getElementById('tour-frame');
    const loading = document.getElementById('tour-loading');
    const fallback = document.getElementById('tour-fallback');
    let timeoutId;

    function hideLoading() {
      loading?.classList.add('is-hidden');
    }

    function showFallback() {
      hideLoading();
      if (fallback) {
        fallback.hidden = false;
        fallback.classList.add('is-visible');
      }
      if (iframe) iframe.style.display = 'none';
    }

    function onLoad() {
      hideLoading();
    }

    iframe?.addEventListener('load', onLoad);
    timeoutId = window.setTimeout(hideLoading, 12000);

    function onMessage(event) {
      if (event.data === 'tour-embed-error') showFallback();
    }

    window.addEventListener('message', onMessage);

    return () => {
      document.body.className = '';
      iframe?.removeEventListener('load', onLoad);
      window.removeEventListener('message', onMessage);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return <VirtualTourContent />;
}
