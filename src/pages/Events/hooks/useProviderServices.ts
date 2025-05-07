
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProviderServices = () => {
  const { user } = useAuth();
  const [userServices, setUserServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user services
  useEffect(() => {
    if (!user) return;

    const fetchUserServices = async () => {
      setLoading(true);
      try {
        console.log('Fetching provider services for user:', user.id);
        const { data, error } = await supabase
          .from('provider_services')
          .select('category')
          .eq('provider_id', user.id);

        if (error) {
          console.error('Error fetching provider services:', error);
          throw error;
        }

        console.log("Provider services fetched:", data);
        setUserServices(data.map(service => service.category));
      } catch (error) {
        console.error('Error fetching provider services:', error);
        toast.error('Erro ao carregar seus serviços');
      } finally {
        setLoading(false);
      }
    };

    fetchUserServices();
  }, [user]);

  return { userServices, loading };
};
