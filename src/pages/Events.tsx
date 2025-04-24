
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Events = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie e visualize todos os seus eventos.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Meus Eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Conteúdo da página de Eventos</p>
          <p className="text-muted-foreground">
            Esta é a página de eventos onde você pode ver e gerenciar seus eventos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
