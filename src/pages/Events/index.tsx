
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { EventsList } from "@/components/events/EventsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Events = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie seus eventos e acompanhe as candidaturas
          </p>
        </div>
        <Button onClick={() => navigate('/events/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </div>

      <EventsList />
    </div>
  );
};

export default Events;
