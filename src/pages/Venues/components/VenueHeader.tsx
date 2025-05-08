
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { venueTypeLabels } from '../constants/venueDetailsConstants';
import { Eye } from "lucide-react";

interface VenueHeaderProps {
  title: string;
  venueType: string;
  maxCapacity: number;
  isRentable: boolean;
  views?: number;  // Adicionando views como propriedade opcional
}

export const VenueHeader = ({ title, venueType, maxCapacity, isRentable, views }: VenueHeaderProps) => {
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
        {views !== undefined && (
          <div className="text-sm text-muted-foreground flex items-center gap-1 ml-auto">
            <Eye className="h-4 w-4" />
            <span>{views} visualizações</span>
          </div>
        )}
      </div>
    </div>
  );
};
