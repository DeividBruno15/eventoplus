
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import VenueCard from "./components/VenueCard";
import VenueLoadingSkeleton from "./components/VenueLoadingSkeleton";
import VenueEmptyState from "./components/VenueEmptyState";
import { useAuth } from "@/hooks/auth";

const VenuesPage = () => {
  const navigate = useNavigate();
  const { announcements, loading } = useVenueAnnouncements();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {isAdvertiser ? "Meus Anúncios" : "Locais de Eventos"}
          </h2>
          <p className="text-muted-foreground">
            {isAdvertiser 
              ? "Gerencie os anúncios dos seus espaços para eventos"
              : "Encontre os melhores locais para seus eventos"
            }
          </p>
        </div>
        {isAdvertiser && (
          <Button 
            onClick={() => navigate('/venues/create')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Anúncio
          </Button>
        )}
      </div>

      {loading ? (
        <VenueLoadingSkeleton />
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <VenueCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      ) : (
        <VenueEmptyState />
      )}
    </div>
  );
};

export default VenuesPage;
