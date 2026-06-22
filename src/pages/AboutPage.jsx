import { useEffect } from 'react';
import AboutContent, { bodyClass } from './content/AboutContent';

export default function AboutPage() {
  useEffect(() => {
    document.body.className = bodyClass;
    return () => {
      document.body.className = '';
    };
  }, []);

  return <AboutContent />;
}
