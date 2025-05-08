
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VenueLocationMap from "./VenueLocationMap";

interface VenueLocationProps {
  venue: {
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode?: string;
  } | null;
}

export const VenueLocation = ({ venue }: VenueLocationProps) => {
  const [showMap, setShowMap] = useState(false);
  
  if (!venue) return null;
  
  const { name, street, number, neighborhood, city, state, zipcode } = venue;
  
  // Format full address for Google Maps link
  const fullAddress = `${street}, ${number} - ${neighborhood}, ${city} - ${state}${zipcode ? ', ' + zipcode : ''}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Localização</h2>
      
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-grow">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-muted-foreground">
              {street}, {number} - {neighborhood}
            </p>
            <p className="text-muted-foreground">
              {city}/{state} {zipcode}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Ocultar mapa" : "Ver no mapa"}
              </Button>
              
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="secondary">
                  Abrir no Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {showMap && venue && (
          <div className="mt-4">
            <VenueLocationMap 
              address={`${street}, ${number}`}
              city={city}
              state={state}
              className="mt-4"
            />
          </div>
        )}
      </Card>
    </div>
  );
};
