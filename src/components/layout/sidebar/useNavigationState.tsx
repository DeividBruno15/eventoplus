
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavigationState(onNavigate: (path: string) => void) {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path: string) => {
    console.log('Sidebar item clicked:', path);
    onNavigate(path);
  };

  return {
    activePath,
    handleLinkClick
  };
}
