
/// <reference types="google.maps" />

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { VenueAnnouncement } from '../types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MapViewProps {
  venues: VenueAnnouncement[];
  onSelectVenue?: (venueId: string) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ venues, onSelectVenue, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  
  // Usar useCallback para evitar recriação desnecessária da função
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      setMapError('Mapa indisponível');
      setLoading(false);
      return;
    }
    
    try {
      // Criar o mapa centrado no Brasil
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -15.77972, lng: -47.92972 }, // Brasília - centro do Brasil
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: false, // Desativar controles padrão e usar nossos botões personalizados
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      const bounds = new window.google.maps.LatLngBounds();
      const markers: google.maps.Marker[] = [];
      const infoWindows: google.maps.InfoWindow[] = [];
      
      // Para cada local, adicionar um marcador
      for (const venue of venues) {
        // Geocodificar o endereço
        if (venue.user_venues) {
          const fullAddress = `${venue.address || ''}, ${venue.user_venues.city}, ${venue.user_venues.state}`;
          
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: fullAddress }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const location = results[0].geometry.location;
              bounds.extend(location);
              
              // Criar marcador melhorado
              const marker = new window.google.maps.Marker({
                position: location,
                map: newMap,
                title: venue.title,
                animation: google.maps.Animation.DROP,
                // Usar ícone personalizado baseado no tipo do local
                icon: {
                  url: getMarkerIcon(venue.venue_type),
                  scaledSize: new google.maps.Size(28, 28) 
                }
              });
              
              // Criar janela de info com mais detalhes e melhor estilo
              const infoContent = `
                <div style="max-width: 250px; padding: 8px">
                  <h3 style="margin-top: 0; margin-bottom: 5px; font-weight: 600; font-size: 16px">${venue.title}</h3>
                  <div style="margin: 8px 0; display: flex; align-items: center">
                    <span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 8px">${venue.venue_type}</span>
                    ${venue.rating ? `<span style="background: #fbbf24; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px">★ ${venue.rating.toFixed(1)}</span>` : ''}
                  </div>
                  <p style="margin: 5px 0; font-weight: 500; font-size: 14px">R$ ${venue.price_per_hour.toFixed(2)}</p>
                  <p style="margin: 0; color: #666; font-size: 13px">${fullAddress}</p>
                  <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                    <a href="/venues/details/${venue.id}" style="color: #1d4ed8; text-decoration: none; font-size: 14px; font-weight: 500;">Ver detalhes</a>
                  </div>
                </div>
              `;
              
              const infoWindow = new window.google.maps.InfoWindow({
                content: infoContent
              });
              
              // Adicionar evento de clique
              marker.addListener('click', () => {
                // Fechar janela de info ativa
                if (activeInfoWindow) {
                  activeInfoWindow.close();
                }
                
                // Abrir esta janela de info
                infoWindow.open(newMap, marker);
                setActiveInfoWindow(infoWindow);
                
                // Animar o marcador ao clicar
                if (marker.getAnimation() !== null) {
                  marker.setAnimation(null);
                } else {
                  marker.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(() => {
                    marker.setAnimation(null);
                  }, 750);
                }
                
                // Chamar callback se existir
                if (onSelectVenue) {
                  onSelectVenue(venue.id);
                }
              });
              
              markers.push(marker);
              infoWindows.push(infoWindow);
              
              // Ajustar o zoom para mostrar todos os marcadores
              if (markers.length === venues.length) {
                if (markers.length > 1) {
                  newMap.fitBounds(bounds);
                } else if (markers.length === 1) {
                  // Se houver apenas um marcador, definir zoom adequado
                  newMap.setCenter(location);
                  newMap.setZoom(14);
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
  }, [venues, onSelectVenue]);
  
  // Função para determinar o ícone baseado no tipo do local
  const getMarkerIcon = (venueType: string): string => {
    // Poderíamos implementar ícones personalizados baseados no tipo do local
    // Por enquanto usaremos o ícone padrão do Google Maps
    return "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
  };
  
  useEffect(() => {
    // Verificar se a API do Google Maps está disponível
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      // Se não estiver disponível, carregar o script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
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
  }, [initializeMap]);
  
  // Funções de controle do mapa
  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  };
  
  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  };
  
  const handleResetView = () => {
    if (map && venues.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      map.data.forEach((feature) => {
        const geometry = feature.getGeometry();
        if (geometry) {
          geometry.forEachLatLng((latLng) => {
            bounds.extend(latLng);
          });
        }
      });
      map.fitBounds(bounds);
    } else if (map) {
      // Reset to default view of Brazil
      map.setCenter({ lat: -15.77972, lng: -47.92972 });
      map.setZoom(5);
    }
  };

  return (
    <Card className={`overflow-hidden relative ${className || ''}`}>
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
      
      {/* Contador de locais visíveis */}
      {!loading && !mapError && (
        <div className="absolute top-4 left-4 bg-white shadow-md rounded-md px-3 py-1.5">
          <span className="text-sm font-medium">
            {venues.length} {venues.length === 1 ? 'local encontrado' : 'locais encontrados'}
          </span>
        </div>
      )}
      
      {/* Controles personalizados */}
      {!loading && !mapError && (
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 bg-white/95 hover:bg-white shadow-md"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 bg-white/95 hover:bg-white shadow-md"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 bg-white/95 hover:bg-white shadow-md"
            onClick={handleResetView}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MapView;
