
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { venueTypeLabels } from '../constants/venueDetailsConstants';

interface VenueHeaderProps {
  title: string;
  venueType: string;
  maxCapacity: number;
  isRentable: boolean;
}

export const VenueHeader = ({ title, venueType, maxCapacity, isRentable }: VenueHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Badge variant="outline">
          {venueTypeLabels[venueType] || venueType}
        </Badge>
        <Badge variant="outline">
          Capacidade: {maxCapacity} pessoas
        </Badge>
        {isRentable ? (
          <Badge className="bg-green-600 text-white">Disponível</Badge>
        ) : (
          <Badge variant="destructive">Indisponível</Badge>
        )}
      </div>
    </div>
  );
};
