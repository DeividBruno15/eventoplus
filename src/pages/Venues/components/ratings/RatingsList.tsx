
import React, { useState } from 'react';
import { VenueRating } from '../../types';
import { VenueRatingItem } from '../VenueRatingItem';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RatingsListProps {
  ratings: VenueRating[];
  isOwner: boolean;
  onReply: (ratingId: string, response: string) => Promise<void>;
  itemsPerPage?: number;
}

const RatingsList: React.FC<RatingsListProps> = ({
  ratings,
  isOwner,
  onReply,
  itemsPerPage = 5
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ratings.length / itemsPerPage);
  
  // Get current ratings
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRatings = ratings.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentRatings.map(rating => (
          <VenueRatingItem 
            key={rating.id} 
            rating={rating}
            isOwner={isOwner}
            onReply={onReply}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RatingsList;
