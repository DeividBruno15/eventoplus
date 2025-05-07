import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useNavigationState(onNavigate: (path: string) => void) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);

  // Keep activePath in sync with the current location
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path: string) => {
    console.log('Sidebar item clicked:', path);
    navigate(path); // Navigate directly
    setActivePath(path);
    onNavigate(path);
  };

  return {
    activePath,
    handleLinkClick
  };
}
