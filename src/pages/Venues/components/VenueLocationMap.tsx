
/// <reference types="google.maps" />

import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  }, [address, city, state]);
  
  const initializeMap = async () => {
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
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]
              }
            ]
          };
          
          const map = new window.google.maps.Map(mapRef.current, mapOptions);
          
          new window.google.maps.Marker({
            position: location,
            map,
            animation: google.maps.Animation.DROP,
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
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
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
    </Card>
  );
};

export default VenueLocationMap;
