
/// <reference types="google.maps" />

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2, Search, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VenueLocationMapProps {
  address: string;
  city: string;
  state: string;
  className?: string;
}

const VenueLocationMap: React.FC<VenueLocationMapProps> = ({ 
  address, 
  city, 
  state,
  className 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  
  // Função para inicializar o mapa, agora como useCallback para evitar recriações desnecessárias
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      setMapError('Mapa indisponível');
      setLoading(false);
      return;
    }
    
    try {
      const fullAddress = `${address}, ${city}, ${state}`;
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: fullAddress }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          
          const mapOptions: google.maps.MapOptions = {
            center: location,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: false, // Desativar controles padrão de zoom e usar nossos botões personalizados
            styles: [
              {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]
              }
            ]
          };
          
          const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
          setMap(newMap);
          
          // Criar marcador com animação
          const newMarker = new window.google.maps.Marker({
            position: location,
            map: newMap,
            animation: google.maps.Animation.DROP,
            title: fullAddress
          });
          setMarker(newMarker);
          
          // Adicionar InfoWindow para mostrar endereço ao clicar no marcador
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px"><strong>${fullAddress}</strong></div>`
          });
          
          newMarker.addListener('click', () => {
            infoWindow.open(newMap, newMarker);
          });
          
          setLoading(false);
        } else {
          setMapError('Localização não encontrada');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      setMapError('Erro ao carregar mapa');
      setLoading(false);
    }
  }, [address, city, state]);
  
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
  
  const handleRecenter = () => {
    if (map && marker) {
      map.setCenter(marker.getPosition()!);
      map.setZoom(15);
    }
  };

  return (
    <Card className={cn("overflow-hidden relative", className)}>
      {loading && (
        <div className="h-80 w-full flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {mapError && !loading && (
        <div className="h-80 w-full flex flex-col items-center justify-center bg-muted/30">
          <div className="text-muted-foreground">{mapError}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {address}, {city}, {state}
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className={cn("h-80 w-full", { "hidden": loading || !!mapError })}
      />
      
      {/* Controles personalizados do mapa */}
      {!loading && !mapError && (
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 bg-white/80 hover:bg-white shadow-md"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 bg-white/80 hover:bg-white shadow-md"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 bg-white/80 hover:bg-white shadow-md"
            onClick={handleRecenter}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VenueLocationMap;
