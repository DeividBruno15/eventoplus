import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useNavigationState(onNavigate?: (path: string) => void) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(true);

  // Keep activePath in sync with the current location
  useEffect(() => {
    console.log("Navigation: Current location path:", location.pathname);
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path: string) => {
    console.log('Sidebar item clicked:', path);
    navigate(path); // Navigate directly
    setActivePath(path);
    if (onNavigate) onNavigate(path);
  };

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return {
    activePath,
    handleLinkClick,
    isOpen,
    toggleSidebar
  };
}
