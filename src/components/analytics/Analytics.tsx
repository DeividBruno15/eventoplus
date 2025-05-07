
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  event: string;
  [key: string]: any;
}

// Esta é uma função de placeholder para simular envio de eventos de analytics
export const trackEvent = (eventData: AnalyticsEvent) => {
  console.log('[Analytics]', eventData);
  
  // Aqui você conectaria com sua plataforma de analytics real
  // Por exemplo, Google Analytics, Mixpanel, etc.
};

export const Analytics = () => {
  const location = useLocation();
  
  // Rastreia mudanças de página
  useEffect(() => {
    trackEvent({
      event: 'page_view',
      page_path: location.pathname,
      page_title: document.title
    });
  }, [location]);
  
  return null;
};

// Hook para facilitar o rastreamento de eventos em componentes
export const useAnalytics = () => {
  return { trackEvent };
};
