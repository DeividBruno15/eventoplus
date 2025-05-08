
import React, { useEffect } from 'react';
import { VenueRating } from '../types';
import CreateVenueRating from './CreateVenueRating';
import VenueDetailedRatings from './VenueDetailedRatings';
import { useVenueRatingsSection } from '../hooks/useVenueRatingsSection';
import RatingsFilter from './ratings/RatingsFilter';
import RatingsEmpty from './ratings/RatingsEmpty';
import RatingsLoading from './ratings/RatingsLoading';
import RatingsList from './ratings/RatingsList';
import AddRatingButton from './ratings/AddRatingButton';
import { Separator } from '@/components/ui/separator';

interface VenueRatingsSectionProps {
  venueId: string;
  ownerId: string;
  userIsAuthenticated?: boolean;
}

const VenueRatingsSection: React.FC<VenueRatingsSectionProps> = ({
  venueId,
  ownerId,
  userIsAuthenticated = false,
}) => {
  const {
    filter,
    setFilter,
    isAddingRating,
    setIsAddingRating,
    ratings,
    loading,
    filteredRatings,
    handleAddRating,
    handleReply,
    hasUserRated,
    isAuthenticated,
    isOwner
  } = useVenueRatingsSection(venueId, ownerId);
  
  // Use the userIsAuthenticated prop if provided, otherwise use the value from the hook
  const isUserAuthenticated = userIsAuthenticated || isAuthenticated;
  
  // Smooth scroll to the rating form when it appears
  useEffect(() => {
    if (isAddingRating) {
      setTimeout(() => {
        const ratingForm = document.getElementById('rating-form');
        if (ratingForm) {
          ratingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isAddingRating]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Avaliações</h2>
      
      {/* Ratings summary */}
      {ratings.length > 0 && !loading && (
        <div className="mt-6">
          <VenueDetailedRatings ratings={ratings} />
          <Separator className="my-6" />
          
          <div className="flex flex-wrap items-center justify-between">
            <RatingsFilter 
              filter={filter}
              onFilterChange={setFilter}
              ratingsCount={ratings.length}
            />
            
            <AddRatingButton
              isAuthenticated={isUserAuthenticated}
              isOwner={isOwner}
              hasUserRated={hasUserRated}
              isAddingRating={isAddingRating}
              onClick={() => setIsAddingRating(true)}
            />
          </div>
        </div>
      )}
      
      {/* Rating form */}
      {isAddingRating && (
        <div id="rating-form" className="mb-8 mt-6 border p-4 rounded-lg bg-card">
          <h3 className="text-lg font-medium mb-4">Sua avaliação</h3>
          <CreateVenueRating 
            venueId={venueId}
            onSuccess={() => handleAddRating()}
            onCancel={() => setIsAddingRating(false)}
          />
        </div>
      )}
      
      {/* Ratings list */}
      <div className="mt-6">
        {loading ? (
          <RatingsLoading />
        ) : filteredRatings.length > 0 ? (
          <RatingsList 
            ratings={filteredRatings} 
            isOwner={isOwner} 
            onReply={handleReply}
          />
        ) : (
          <RatingsEmpty 
            hasRatings={ratings.length > 0}
            isAuthenticated={isUserAuthenticated}
            isOwner={isOwner}
            onAddRating={() => setIsAddingRating(true)}
          />
        )}
      </div>
    </div>
  );
};

export default VenueRatingsSection;
