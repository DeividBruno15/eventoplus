
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const EventsHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meus Eventos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie os seus eventos e veja propostas de prestadores
        </p>
      </div>
      <Button asChild>
        <Link to="/events/create" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Criar Evento</span>
        </Link>
      </Button>
    </div>
  );
};
