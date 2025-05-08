
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-muted-foreground">
              {street}, {number} - {neighborhood}
            </p>
            <p className="text-muted-foreground">
              {city}/{state} {zipcode}
            </p>
            
            <a 
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-primary hover:underline text-sm"
            >
              Ver no Google Maps
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
