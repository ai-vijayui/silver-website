import { useEffect } from 'react';
import ProjectsContent, { bodyClass } from './content/ProjectsContent';

export default function ProjectsPage() {
  useEffect(() => {
    document.body.className = bodyClass;
    return () => {
      document.body.className = '';
    };
  }, []);

  return <ProjectsContent />;
}
