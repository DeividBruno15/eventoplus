
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingWithUser } from '@/types/ratings';

interface UseUserRatingsProps {
  userId: string;
  eventId?: string;
}

export const useUserRatings = ({ userId, eventId }: UseUserRatingsProps) => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);

      try {
        // Query para buscar as avaliações com informações do autor
        let query = supabase
          .from('ratings')
          .select(`
            *,
            reviewer:reviewer_id (
              id,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        // Adicionar filtro por evento, se fornecido
        if (eventId) {
          query = query.eq('event_id', eventId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transformar dados para o formato esperado
        const ratingsWithUser = data.map((rating: any): RatingWithUser => ({
          ...rating,
          reviewer_name: `${rating.reviewer.first_name} ${rating.reviewer.last_name || ''}`.trim(),
          reviewer_avatar: rating.reviewer.avatar_url,
        }));

        setRatings(ratingsWithUser);
        setTotalRatings(ratingsWithUser.length);

        // Calcular média das avaliações
        if (ratingsWithUser.length > 0) {
          const sum = ratingsWithUser.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(sum / ratingsWithUser.length);
        } else {
          setAverageRating(0);
        }
      } catch (err: any) {
        console.error('Erro ao buscar avaliações:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRatings();
    }
  }, [userId, eventId]);

  // Função para atualizar avaliações após adicionar uma nova
  const refreshRatings = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          reviewer:reviewer_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar dados para o formato esperado
      const ratingsWithUser = data.map((rating: any): RatingWithUser => ({
        ...rating,
        reviewer_name: `${rating.reviewer.first_name} ${rating.reviewer.last_name || ''}`.trim(),
        reviewer_avatar: rating.reviewer.avatar_url,
      }));

      setRatings(ratingsWithUser);
      setTotalRatings(ratingsWithUser.length);

      // Calcular média das avaliações
      if (ratingsWithUser.length > 0) {
        const sum = ratingsWithUser.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating(sum / ratingsWithUser.length);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar avaliações:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    ratings,
    loading,
    error,
    averageRating,
    totalRatings,
    refreshRatings
  };
};
