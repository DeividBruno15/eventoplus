
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Define an interface for our service request data
interface ServiceRequest {
  id: string;
  event_type: string;
  status: string;
  provider: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ContractorDashboardProps {
  userName: string;
}

const ContractorDashboard = ({ userName }: ContractorDashboardProps) => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          id,
          event_type,
          status,
          provider:user_profiles!provider_id(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as ServiceRequest[];
    }
  });

  if (isLoading) {
    return <Loader2 className="w-6 h-6 animate-spin" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-muted-foreground mt-2">
          Bem-vindo(a) ao seu Dashboard de Contratante.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Últimas Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          {requests?.length === 0 ? (
            <p className="text-gray-600">Nenhuma solicitação encontrada</p>
          ) : (
            <ul className="space-y-4">
              {requests?.map((request) => (
                <li key={request.id} className="border-b pb-4 last:border-0">
                  <p className="font-medium text-gray-900">
                    {request.event_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.provider?.first_name} {request.provider?.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {request.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractorDashboard;
