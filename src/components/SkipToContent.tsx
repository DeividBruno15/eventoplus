
import { useCallback, useRef } from 'react';

export const SkipToContent = () => {
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  
  const handleSkip = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.setAttribute('tabindex', '-1');
      
      // Remove o tabindex depois que o elemento perde o foco
      mainContent.addEventListener('blur', () => {
        mainContent.removeAttribute('tabindex');
      }, { once: true });
    }
  }, []);
  
  return (
    <>
      <a 
        href="#main-content" 
        className="skip-to-content" 
        onClick={handleSkip}
      >
        Pular para o conteúdo
      </a>
      <div id="main-content" ref={mainContentRef} className="outline-none"></div>
    </>
  );
};
