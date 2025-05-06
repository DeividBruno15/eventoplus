
import React from 'react';

interface VenueDescriptionProps {
  description: string;
}

export const VenueDescription = ({ description }: VenueDescriptionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Descrição</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};
