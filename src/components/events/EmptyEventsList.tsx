
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const EmptyEventsList = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="text-center py-16">
      <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
      <p className="text-muted-foreground mb-6">
        Crie seu primeiro evento e comece a organizar!
      </p>
      <Button onClick={() => navigate('/events/create')}>
        <Plus className="h-4 w-4 mr-2" />
        Criar Evento
      </Button>
    </Card>
  );
};
