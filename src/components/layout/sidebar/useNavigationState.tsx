
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useNavigationState(onNavigate: (path: string) => void) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path: string) => {
    console.log('Sidebar item clicked:', path);
    setActivePath(path);
    onNavigate(path);
  };

  return {
    activePath,
    handleLinkClick
  };
}
