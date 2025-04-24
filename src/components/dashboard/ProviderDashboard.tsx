
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ProviderDashboard = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['provider-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          contractor:contractor_id(
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <Loader2 className="w-6 h-6 animate-spin" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {requests?.length === 0 ? (
            <p className="text-gray-600">Nenhuma solicitação pendente</p>
          ) : (
            <ul className="space-y-4">
              {requests?.map((request) => (
                <li key={request.id} className="border-b pb-4 last:border-0">
                  <p className="font-medium text-gray-900">
                    {request.event_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    Solicitado por: {request.contractor.first_name} {request.contractor.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cidade: {request.city}
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

export default ProviderDashboard;
