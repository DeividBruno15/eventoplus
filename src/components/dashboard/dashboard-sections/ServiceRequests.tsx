
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigateFunction } from "react-router-dom";

interface ServiceRequestsProps {
  navigate: NavigateFunction;
}

export const ServiceRequests = ({ navigate }: ServiceRequestsProps) => {
  const serviceRequests = [
    { id: 1, title: "Orçamento para Festa", client: "João Silva", status: "novo", date: "14/05", type: "Buffet" },
    { id: 2, title: "Casamento 150 pessoas", client: "Maria Oliveira", status: "em análise", date: "28/04", type: "Decoração" },
    { id: 3, title: "Evento Corporativo", client: "Empresa ABC", status: "orçamento enviado", date: "05/04", type: "Iluminação" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-2xl">Solicitações Recentes</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Pedidos de orçamento e serviço
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {serviceRequests.map((request) => (
          <div key={request.id} className="p-2 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h3 className="text-sm md:text-base font-medium truncate mr-2">{request.title}</h3>
              <Badge className="text-xs" variant={
                request.status === 'novo' ? 'default' :
                request.status === 'em análise' ? 'secondary' : 'outline'
              }>
                {request.status}
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-gray-600 truncate">Cliente: {request.client}</p>
            <div className="flex items-center justify-between mt-1 md:mt-2 text-xs text-gray-500">
              <span>Tipo: {request.type}</span>
              <span>Recebido: {request.date}</span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-xs md:text-sm" onClick={() => navigate("/events")}>
          Ver Todas as Solicitações
        </Button>
      </CardFooter>
    </Card>
  );
};
