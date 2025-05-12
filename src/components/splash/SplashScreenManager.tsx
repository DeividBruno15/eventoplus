
import { useState, useEffect } from 'react';
import { SplashScreen } from './SplashScreen';

interface SplashScreenManagerProps {
  children: React.ReactNode;
}

export const SplashScreenManager = ({ children }: SplashScreenManagerProps) => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Check if splash screen has already been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      setShowSplash(false);
    } else {
      // Mark that splash screen has been shown
      sessionStorage.setItem('splashShown', 'true');
      
      // Hide splash after 3 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (showSplash) {
    return <SplashScreen />;
  }
  
  return <>{children}</>;
};
