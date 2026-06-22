import { useEffect } from 'react';
import HomeContent, { bodyClass } from './content/HomeContent';

export default function HomePage() {
  useEffect(() => {
    document.body.className = bodyClass;
    return () => {
      document.body.className = '';
    };
  }, []);

  return <HomeContent />;
}
