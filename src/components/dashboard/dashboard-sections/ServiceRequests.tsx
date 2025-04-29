
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigateFunction } from "react-router-dom";

interface ServiceRequestsProps {
  navigate: NavigateFunction;
}

export const ServiceRequests = ({ navigate }: ServiceRequestsProps) => {
  const serviceRequests = [
    { id: 1, title: "Orçamento para Festa", client: "João Silva", status: "novo", date: "14/05/2025", type: "Buffet" },
    { id: 2, title: "Casamento 150 pessoas", client: "Maria Oliveira", status: "em análise", date: "28/04/2025", type: "Decoração" },
    { id: 3, title: "Evento Corporativo", client: "Empresa ABC", status: "orçamento enviado", date: "05/04/2025", type: "Iluminação" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações Recentes</CardTitle>
        <CardDescription>
          Pedidos de orçamento e solicitações de serviço
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {serviceRequests.map((request) => (
          <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{request.title}</h3>
              <Badge variant={
                request.status === 'novo' ? 'default' :
                request.status === 'em análise' ? 'secondary' : 'outline'
              }>
                {request.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Cliente: {request.client}</p>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
              <span>Tipo: {request.type}</span>
              <span>Recebido em: {request.date}</span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => navigate("/events")}>
          Ver Todas as Solicitações
        </Button>
      </CardFooter>
    </Card>
  );
};
