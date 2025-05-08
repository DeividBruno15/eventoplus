
import React from 'react';
import { VenueRating } from '../types';
import CreateVenueRating from './CreateVenueRating';
import VenueDetailedRatings from './VenueDetailedRatings';
import { useVenueRatingsSection } from '../hooks/useVenueRatingsSection';
import RatingsFilter from './ratings/RatingsFilter';
import RatingsEmpty from './ratings/RatingsEmpty';
import RatingsLoading from './ratings/RatingsLoading';
import RatingsList from './ratings/RatingsList';
import AddRatingButton from './ratings/AddRatingButton';

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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
      
      {/* Sumário de avaliações */}
      {ratings.length > 0 && !loading && (
        <>
          <VenueDetailedRatings ratings={ratings} />
          
          <div className="flex flex-wrap items-center justify-between mt-6 mb-4">
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
        </>
      )}
      
      {/* Formulário para adicionar avaliação */}
      {isAddingRating && (
        <div className="mb-6">
          <CreateVenueRating 
            venueId={venueId}
            onSuccess={handleAddRating}
            onCancel={() => setIsAddingRating(false)}
          />
        </div>
      )}
      
      {/* Lista de avaliações */}
      <div className="space-y-4">
        {!loading ? (
          filteredRatings.length > 0 ? (
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
          )
        ) : (
          <RatingsLoading />
        )}
      </div>
    </div>
  );
};

export default VenueRatingsSection;
