
import React from 'react';
import { Wifi, Car, Home, Music, Kitchen, Snowflake, Lightbulb } from "lucide-react";
import { amenityLabels } from '../constants/venueDetailsConstants';

interface VenueAmenitiesProps {
  amenities: string[];
}

export const VenueAmenities = ({ amenities }: VenueAmenitiesProps) => {
  // Map de ícones para cada tipo de amenity
  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="h-4 w-4" />,
    parking: <Car className="h-4 w-4" />,
    restrooms: <Home className="h-4 w-4" />,
    stage: <Music className="h-4 w-4" />,
    kitchen: <Kitchen className="h-4 w-4" />,
    aircon: <Snowflake className="h-4 w-4" />,
    sound: <Music className="h-4 w-4" />,
    lighting: <Lightbulb className="h-4 w-4" />,
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Comodidades</h2>
      {amenities && amenities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {amenities.map((amenity) => (
            <div 
              key={amenity} 
              className="flex items-center gap-2 p-2 rounded-md border bg-muted/20"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {amenityIcons[amenity] || <Home className="h-4 w-4" />}
              </div>
              <span className="text-sm">
                {amenityLabels[amenity] || amenity}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhuma comodidade informada</p>
      )}
    </div>
  );
};
