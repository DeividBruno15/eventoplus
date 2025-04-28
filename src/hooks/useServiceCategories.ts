
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ServiceCategory {
  id: string;
  name: string;
}

export const useServiceCategories = () => {
  const query = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};
