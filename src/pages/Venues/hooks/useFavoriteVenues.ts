
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

export const useFavoriteVenues = () => {
  const [favoriteVenues, setFavoriteVenues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Função para buscar todos os locais favoritos do usuário
  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteVenues([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('venue_favorites')
        .select('venue_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setFavoriteVenues(data.map(item => item.venue_id));
    } catch (error) {
      console.error('Erro ao buscar locais favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar se um local está na lista de favoritos
  const isVenueFavorite = (venueId: string): boolean => {
    return favoriteVenues.includes(venueId);
  };
  
  // Adicionar um local aos favoritos
  const addFavorite = async (venueId: string, venueName: string) => {
    if (!user) {
      toast.error('Faça login para adicionar aos favoritos');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('venue_favorites')
        .insert({
          user_id: user.id,
          venue_id: venueId,
          venue_name: venueName
        });
        
      if (error) throw error;
      
      setFavoriteVenues([...favoriteVenues, venueId]);
      toast.success('Local adicionado aos favoritos');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      toast.error('Erro ao adicionar aos favoritos');
      return false;
    }
  };
  
  // Remover um local dos favoritos
  const removeFavorite = async (venueId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('venue_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('venue_id', venueId);
        
      if (error) throw error;
      
      setFavoriteVenues(favoriteVenues.filter(id => id !== venueId));
      toast.success('Local removido dos favoritos');
      return true;
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      toast.error('Erro ao remover dos favoritos');
      return false;
    }
  };
  
  // Alternar entre favorito/não favorito
  const toggleFavorite = async (venueId: string, venueName: string) => {
    if (isVenueFavorite(venueId)) {
      return await removeFavorite(venueId);
    } else {
      return await addFavorite(venueId, venueName);
    }
  };
  
  // Carregar favoritos quando o usuário mudar
  useEffect(() => {
    fetchFavorites();
  }, [user]);
  
  return {
    favoriteVenues,
    isLoading,
    isVenueFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    fetchFavorites
  };
};
