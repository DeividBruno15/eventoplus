
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RatingWithUser } from '@/types/ratings';
import { useToast } from '@/components/ui/use-toast';

interface UseUserRatingsProps {
  userId: string;
  limit?: number;
}

export const useUserRatings = ({ userId, limit }: UseUserRatingsProps) => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        
        // Buscar avaliações
        let query = supabase
          .from('ratings')
          .select(`
            *,
            reviewer:reviewer_id(
              id,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        // Aplicar limite se especificado
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transformar os dados
        const formattedRatings: RatingWithUser[] = data.map((item: any) => ({
          ...item,
          reviewer_name: `${item.reviewer.first_name} ${item.reviewer.last_name || ''}`.trim(),
          reviewer_avatar: item.reviewer.avatar_url,
        }));
        
        setRatings(formattedRatings);
        
        // Calcular média de avaliações
        if (formattedRatings.length > 0) {
          const sum = formattedRatings.reduce((acc, item) => acc + item.rating, 0);
          setAverageRating(sum / formattedRatings.length);
          setTotalRatings(formattedRatings.length);
        }
        
      } catch (error: any) {
        console.error('Erro ao buscar avaliações:', error);
        toast({
          title: "Erro ao carregar avaliações",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchRatings();
    }
  }, [userId, limit, toast]);
  
  return { ratings, loading, averageRating, totalRatings };
};
