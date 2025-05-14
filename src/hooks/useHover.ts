
import { useRef, useState, useEffect } from 'react';

export function useHover<T extends HTMLElement = HTMLDivElement>(): [boolean, React.RefObject<T>] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    
    if (!node) {
      return;
    }
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);
  
  return [isHovered, ref];
}
