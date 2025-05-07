
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  id: string;
  name: string;
}

export const useServiceCategories = () => {
  const query = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      console.log('Fetching service categories...');
      const { data, error } = await supabase
        .from('service_categories')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching service categories:', error);
        throw error;
      }
      
      console.log('Service categories fetched:', data);
      return data;
    }
  });

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};
