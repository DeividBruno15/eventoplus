
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { amenityLabels } from '../constants/venueDetailsConstants';

interface VenueAmenitiesProps {
  amenities: string[];
}

export const VenueAmenities = ({ amenities }: VenueAmenitiesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Comodidades</h2>
      <div className="flex flex-wrap gap-2">
        {amenities && amenities.length > 0 ? (
          amenities.map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-sm">
              {amenityLabels[amenity] || amenity}
            </Badge>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma comodidade informada</p>
        )}
      </div>
    </div>
  );
};
