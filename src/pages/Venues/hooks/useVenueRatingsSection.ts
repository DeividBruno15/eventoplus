
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VenueRating } from '../types';
import { useVenueRatings } from './useVenueRatings';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

export const useVenueRatingsSection = (venueId: string, ownerId: string) => {
  const [filter, setFilter] = useState<string>('all');
  const [isAddingRating, setIsAddingRating] = useState<boolean>(false);
  
  const { user } = useAuth();
  const { ratings, loading, addRating, updateRating } = useVenueRatings(venueId);
  
  const isAuthenticated = user ? true : false;
  const isOwner = user?.id === ownerId;

  const handleAddRating = (newRating: VenueRating) => {
    addRating(newRating);
    setIsAddingRating(false);
  };

  const handleReply = async (ratingId: string, response: string) => {
    try {
      const { error } = await supabase
        .from('venue_ratings')
        .update({
          owner_response: {
            response,
            created_at: new Date().toISOString()
          }
        })
        .eq('id', ratingId);
        
      if (error) throw error;
      
      // Atualizar avaliação no estado local
      updateRating(ratingId, {
        owner_response: {
          response,
          created_at: new Date().toISOString()
        }
      });
      
      toast.success('Resposta enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
      toast.error('Erro ao enviar resposta. Tente novamente.');
    }
  };

  const filteredRatings = () => {
    if (filter === 'all') return ratings;
    
    const ratingValue = parseInt(filter);
    return ratings.filter(rating => 
      Math.floor(rating.overall_rating) === ratingValue
    );
  };

  const hasUserRated = () => {
    if (!user) return false;
    return ratings.some(rating => rating.user_id === user.id);
  };

  return {
    filter,
    setFilter,
    isAddingRating,
    setIsAddingRating,
    ratings,
    loading,
    filteredRatings: filteredRatings(),
    handleAddRating,
    handleReply,
    hasUserRated: hasUserRated(),
    isAuthenticated,
    isOwner
  };
};
