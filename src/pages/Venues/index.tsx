
import { useAuth } from "@/hooks/auth";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import { useVenueFilters } from "./hooks/useVenueFilters";

import VenuePageHeader from "./components/VenuePageHeader";
import VenueFilters from "./components/VenueFilters";
import VenuesGrid from "./components/VenuesGrid";
import { toast } from "sonner";

const VenuesPage = () => {
  const { announcements, loading, refetchAnnouncements } = useVenueAnnouncements();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';
  
  const { filters, setFilters, filteredAnnouncements } = useVenueFilters(announcements);
  
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <VenuePageHeader isAdvertiser={isAdvertiser} />

      {!isAdvertiser && (
        <VenueFilters 
          filters={filters}
          onFilterChange={setFilters}
          resultsCount={filteredAnnouncements.length}
        />
      )}

      <VenuesGrid 
        announcements={filteredAnnouncements} 
        loading={loading} 
        onDeleteAnnouncement={handleDeleteAnnouncement}
      />
    </div>
  );
};

export default VenuesPage;
