
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { VenueAnnouncement } from '../types';

interface MapViewProps {
  venues: VenueAnnouncement[];
  onSelectVenue?: (venueId: string) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ venues, onSelectVenue, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  
  useEffect(() => {
    // Verificar se a API do Google Maps está disponível
    if (!window.google || !window.google.maps) {
      // Se não estiver disponível, carregar o script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => initializeMap();
      script.onerror = () => {
        setMapError('Não foi possível carregar o mapa');
        setLoading(false);
      };
      
      document.head.appendChild(script);
      return;
    }
    
    // Se a API já estiver disponível
    initializeMap();
  }, [venues]);
  
  const initializeMap = async () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      setMapError('Mapa indisponível');
      setLoading(false);
      return;
    }
    
    try {
      // Criar o mapa centrado no Brasil
      const mapOptions = {
        center: { lat: -15.77972, lng: -47.92972 }, // Brasília - centro do Brasil
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      const bounds = new window.google.maps.LatLngBounds();
      const markers: google.maps.Marker[] = [];
      const infoWindows: google.maps.InfoWindow[] = [];
      
      // Para cada local, adicionar um marcador
      for (const venue of venues) {
        // Geocodificar o endereço
        if (venue.user_venues) {
          const fullAddress = `${venue.address || ''}, ${venue.user_venues.city}, ${venue.user_venues.state}`;
          
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: fullAddress }, (results: any, status: string) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              bounds.extend(location);
              
              // Criar marcador
              const marker = new window.google.maps.Marker({
                position: location,
                map,
                title: venue.title,
                animation: window.google.maps.Animation.DROP,
              });
              
              // Criar janela de info
              const infoContent = `
                <div style="max-width: 200px">
                  <h3 style="margin-top: 0; margin-bottom: 5px; font-weight: 600">${venue.title}</h3>
                  <p style="margin: 0; color: #666">${venue.venue_type}</p>
                  <p style="margin: 5px 0; font-weight: 500">R$ ${venue.price_per_hour.toFixed(2)}</p>
                  <div style="margin-top: 10px">
                    <a href="/venues/details/${venue.id}" style="color: #1d4ed8; text-decoration: none">Ver detalhes</a>
                  </div>
                </div>
              `;
              
              const infoWindow = new window.google.maps.InfoWindow({
                content: infoContent
              });
              
              // Adicionar evento de clique
              marker.addListener('click', () => {
                // Fechar todas as janelas de info abertas
                infoWindows.forEach(iw => iw.close());
                
                // Abrir esta janela de info
                infoWindow.open(map, marker);
                
                // Chamar callback se existir
                if (onSelectVenue) {
                  onSelectVenue(venue.id);
                }
              });
              
              markers.push(marker);
              infoWindows.push(infoWindow);
              
              // Ajustar o zoom para mostrar todos os marcadores
              if (markers.length === venues.length) {
                map.fitBounds(bounds);
                
                // Se houver apenas um marcador, definir zoom adequado
                if (markers.length === 1) {
                  map.setZoom(14);
                }
              }
            }
          });
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      setMapError('Erro ao carregar mapa');
      setLoading(false);
    }
  };

  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      {loading && (
        <div className="h-[600px] w-full flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {mapError && !loading && (
        <div className="h-[600px] w-full flex flex-col items-center justify-center bg-muted/30">
          <div className="text-muted-foreground">{mapError}</div>
          <div className="text-sm text-muted-foreground mt-2">
            Não foi possível carregar o mapa de locais
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className={`h-[600px] w-full ${(loading || !!mapError) ? 'hidden' : ''}`}
      />
    </Card>
  );
};

export default MapView;
