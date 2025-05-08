
import React from 'react';
import { VenueRating } from '../../types';
import { VenueRatingItem } from '../VenueRatingItem';

interface RatingsListProps {
  ratings: VenueRating[];
  isOwner: boolean;
  onReply: (ratingId: string, response: string) => Promise<void>;
}

const RatingsList: React.FC<RatingsListProps> = ({
  ratings,
  isOwner,
  onReply
}) => {
  return (
    <div className="space-y-4">
      {ratings.map(rating => (
        <VenueRatingItem 
          key={rating.id} 
          rating={rating}
          isOwner={isOwner}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default RatingsList;
