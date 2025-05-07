
import { useAuth } from "@/hooks/auth";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import { useVenueFilters } from "./hooks/useVenueFilters";

import VenuePageHeader from "./components/VenuePageHeader";
import VenueFilters from "./components/VenueFilters";
import VenuesGrid from "./components/VenuesGrid";
import { useState } from "react";

const VenuesPage = () => {
  const { announcements, loading, refetchAnnouncements } = useVenueAnnouncements();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';
  
  const { filters, setFilters, filteredAnnouncements } = useVenueFilters(announcements);
  
  const handleDeleteAnnouncement = async (id: string) => {
    // Apenas refetch após exclusão bem-sucedida para atualizar a lista
    await refetchAnnouncements();
  };

  return (
    <div className="space-y-6">
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
