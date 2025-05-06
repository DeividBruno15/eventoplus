
import { useAuth } from "@/hooks/auth";
import { useVenueAnnouncements } from "./hooks/useVenueAnnouncements";
import { useVenueFilters } from "./hooks/useVenueFilters";

import VenuePageHeader from "./components/VenuePageHeader";
import VenueFilters from "./components/VenueFilters";
import VenuesGrid from "./components/VenuesGrid";

const VenuesPage = () => {
  const { announcements, loading } = useVenueAnnouncements();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';
  
  const { filters, setFilters, filteredAnnouncements } = useVenueFilters(announcements);

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
      />
    </div>
  );
};

export default VenuesPage;
