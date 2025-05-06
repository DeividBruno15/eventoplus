
import React from 'react';

interface VenueImageProps {
  imageUrl: string | null;
  title: string;
}

export const VenueImage = ({ imageUrl, title }: VenueImageProps) => {
  if (!imageUrl) return null;
  
  return (
    <div className="rounded-lg overflow-hidden h-80 bg-gray-100">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
