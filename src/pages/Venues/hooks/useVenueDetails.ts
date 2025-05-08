
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VenueDetails } from "../types/venueDetailsTypes";

/**
 * Hook para buscar os detalhes de um local
 * @param id ID do anúncio do local
 */
export const useVenueDetails = (id?: string) => {
  const [venue, setVenue] = useState<VenueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('venue_announcements')
          .select(`
            *,
            user_venues (*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw new Error(error.message);
        
        // Converter available_dates de string[] para Date[]
        const availableDates = data.available_dates 
          ? data.available_dates.map((date: string) => new Date(date))
          : [];
        
        setSelectedDates(availableDates);
        
        // Formatar os dados para o formato esperado
        const venueDetails: VenueDetails = {
          ...data,
          venue: data.user_venues,
          image_urls: data.image_urls || (data.image_url ? [data.image_url] : []),
          views: typeof data.views === 'number' ? data.views : 0
        };
        
        setVenue(venueDetails);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes do local:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenueDetails();
  }, [id]);
  
  // Função para incrementar a contagem de visualizações
  const incrementViewCount = async (venueId: string) => {
    try {
      // Primeiro, obter a contagem atual
      const { data: currentData, error: fetchError } = await supabase
        .from('venue_announcements')
        .select('views')
        .eq('id', venueId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Incrementar a contagem em 1
      const newViewCount = (currentData?.views || 0) + 1;
      
      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('venue_announcements')
        .update({ views: newViewCount })
        .eq('id', venueId);
        
      if (updateError) throw updateError;
      
      // Atualizar o estado local
      setVenue(prev => prev ? {...prev, views: newViewCount} : null);
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
      // Não lançar erro para não interromper a experiência do usuário
    }
  };
  
  return { venue, loading, error, selectedDates, incrementViewCount };
};
