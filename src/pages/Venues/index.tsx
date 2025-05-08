
import { useAuth } from "@/hooks/auth";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import { useVenueFilters } from "./hooks/useVenueFilters";

import VenuePageHeader from "./components/VenuePageHeader";
import VenueFilters from "./components/VenueFilters";
import VenuesGrid from "./components/VenuesGrid";
import { toast } from "sonner";
import { useState } from "react";
import MapView from "./components/MapView";
import { Button } from "@/components/ui/button";
import { Grid, MapPin } from "lucide-react";

const VenuesPage = () => {
  const { announcements, loading, refetchAnnouncements } = useVenueAnnouncements();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';
  
  const { filters, setFilters, filteredAnnouncements } = useVenueFilters(announcements);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const response = await fetch(`/api/venues/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir anúncio');
      }
      
      toast.success('Anúncio excluído com sucesso!');
      // Refetch após exclusão bem-sucedida para atualizar a lista
      await refetchAnnouncements();
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
      toast.error('Erro ao excluir anúncio. Tente novamente.');
    }
  };
  
  const handleVenueSelect = (venueId: string) => {
    // Redirecionar para a página de detalhes do local
    window.location.href = `/venues/details/${venueId}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <VenuePageHeader isAdvertiser={isAdvertiser} />

      {!isAdvertiser && (
        <>
          <VenueFilters 
            filters={filters}
            onFilterChange={setFilters}
            resultsCount={filteredAnnouncements.length}
          />
          
          <div className="flex justify-end gap-2 mb-4">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Mapa
            </Button>
          </div>
        </>
      )}

      {viewMode === 'grid' ? (
        <VenuesGrid 
          announcements={filteredAnnouncements} 
          loading={loading} 
          onDeleteAnnouncement={handleDeleteAnnouncement}
        />
      ) : (
        <MapView 
          venues={filteredAnnouncements} 
          onSelectVenue={handleVenueSelect}
        />
      )}
    </div>
  );
};

export default VenuesPage;
