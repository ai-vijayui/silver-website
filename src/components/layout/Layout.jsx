import { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header, { MobileMenu } from './Header';
import Footer from './Footer';
import { usePageEffects } from '../../hooks/usePageEffects';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const transparentHeader =
    location.pathname === '/' || location.pathname === '/projects';
  const showMain = location.pathname !== '/virtual-tour';

  usePageEffects();
  useScrollAnimations();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    closeMenu();
    window.scrollTo(0, 0);
  }, [location.pathname, closeMenu]);

  return (
    <>
      <Header transparent={transparentHeader} menuOpen={menuOpen} onMenuToggle={toggleMenu} />
      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
      {showMain ? (
        <main>
          <Outlet key={location.pathname} />
        </main>
      ) : (
        <Outlet key={location.pathname} />
      )}
      <Footer />
    </>
  );
}
