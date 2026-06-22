import { useEffect } from 'react';
import ContactContent, { bodyClass } from './content/ContactContent';

export default function ContactPage() {
  useEffect(() => {
    document.body.className = bodyClass;
    return () => {
      document.body.className = '';
    };
  }, []);

  return <ContactContent />;
}
