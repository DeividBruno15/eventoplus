
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VenueRating } from '../types';
import { toast } from 'sonner';

export const useVenueRatings = (venueId: string) => {
  const [ratings, setRatings] = useState<VenueRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('venue_ratings')
          .select(`
            *,
            user_profiles:user_id (first_name, last_name, avatar_url)
          `)
          .eq('venue_id', venueId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Formatar dados
        const formattedRatings: VenueRating[] = data.map(item => ({
          id: item.id,
          venue_id: item.venue_id,
          user_id: item.user_id,
          overall_rating: item.overall_rating,
          location_rating: item.location_rating,
          value_rating: item.value_rating,
          service_rating: item.service_rating,
          cleanliness_rating: item.cleanliness_rating,
          amenities_rating: item.amenities_rating,
          comment: item.comment,
          created_at: item.created_at,
          user_name: item.user_profiles ? 
            `${item.user_profiles.first_name} ${item.user_profiles.last_name || ''}`.trim() : 
            'Usuário',
          user_avatar: item.user_profiles?.avatar_url,
          owner_response: item.owner_response
        }));
        
        setRatings(formattedRatings);
      } catch (err: any) {
        console.error('Erro ao buscar avaliações:', err);
        setError(err.message);
        toast.error('Falha ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchRatings();
    }
  }, [venueId]);

  // Função para adicionar uma nova avaliação à lista
  const addRating = (rating: VenueRating) => {
    setRatings(prev => [rating, ...prev]);
  };

  // Função para atualizar uma avaliação existente (quando um proprietário responde)
  const updateRating = (ratingId: string, updatedData: Partial<VenueRating>) => {
    setRatings(prev => 
      prev.map(rating => 
        rating.id === ratingId ? { ...rating, ...updatedData } : rating
      )
    );
  };

  return { ratings, loading, error, addRating, updateRating };
};
