
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface VenueLocationProps {
  venue: {
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  } | null;
}

export const VenueLocation = ({ venue }: VenueLocationProps) => {
  if (!venue) return null;

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Local</h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">{venue.name}</span>
          </p>
          <p className="text-gray-700">
            {venue.street}, {venue.number} - {venue.neighborhood}
          </p>
          <p className="text-gray-700">
            {venue.city}/{venue.state} - CEP: {venue.zipcode}
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
};
