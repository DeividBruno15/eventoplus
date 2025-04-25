
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EventsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Events</h2>
        <p className="text-muted-foreground mt-2">
          Manage and view all your events.
        </p>
      </div>
      <Button onClick={() => navigate('/events/create')}>
        <Plus className="mr-2 h-4 w-4" /> Create Event
      </Button>
    </div>
  );
};
