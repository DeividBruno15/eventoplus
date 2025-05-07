
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import ProviderDashboardContent from "./ProviderDashboardContent";

// Define an interface for our service request data
interface DashboardServiceRequest {
  id: string;
  event_type: string;
  city: string;
  contractor: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

const ProviderDashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.first_name || 'Usuário';
  
  const { data: requests, isLoading } = useQuery({
    queryKey: ['provider-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          id,
          event_type,
          city,
          contractor:user_profiles!contractor_id(id, first_name, last_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Properly format the data to match our interface
      const formattedData = data?.map(item => ({
        id: item.id,
        event_type: item.event_type,
        city: item.city,
        contractor: Array.isArray(item.contractor) && item.contractor.length > 0 
          ? {
              id: item.contractor[0].id,
              first_name: item.contractor[0].first_name,
              last_name: item.contractor[0].last_name
            }
          : null
      })) as DashboardServiceRequest[];
      
      return formattedData || [];
    }
  });

  console.log("Provider Dashboard - Rendering with user:", userName);

  return <ProviderDashboardContent userName={userName} />;
};

export default ProviderDashboard;
