
import { useState, useEffect } from 'react';

export const useBreakpoint = (breakpoint: string) => {
  const breakpoints = {
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536
  };
  
  const breakpointSize = breakpoints[breakpoint as keyof typeof breakpoints] || 0;
  
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= breakpointSize : false
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkSize = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpointSize);
    };
    
    // Check on mount
    checkSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpointSize]);
  
  return {
    isDesktop: isAboveBreakpoint,
    isMobile: !isAboveBreakpoint
  };
};
