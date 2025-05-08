
import React, { useState, useEffect } from "react";
import { FiltersState } from "../hooks/useVenueFilters";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import SearchInput from "./filters/SearchInput";
import SortingSelect from "./filters/SortingSelect";
import MobileFiltersDrawer from "./filters/MobileFiltersDrawer";
import DesktopFiltersPanel from "./filters/DesktopFiltersPanel";

interface VenueFiltersProps {
  filters: FiltersState;
  onFilterChange: (newFilters: FiltersState) => void;
  resultsCount: number;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({
  filters,
  onFilterChange,
  resultsCount,
}) => {
  const { isDesktop } = useBreakpoint("md");
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters);

  // Reset local filters when main filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value };
    onFilterChange(newFilters);
  };

  const handleFilterChange = (field: keyof FiltersState, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (location: FiltersState["location"]) => {
    setLocalFilters((prev) => ({ ...prev, location }));
  };

  const handleMaxDistanceChange = (distance: number) => {
    setLocalFilters((prev) => ({ ...prev, maxDistance: distance }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetFiltersState: FiltersState = {
      searchQuery: filters.searchQuery, // Keep search query
      venueType: undefined,
      minRating: undefined,
      priceRange: [0, 10000],
      sortBy: "newest",
      location: undefined,
      maxDistance: 50,
    };

    setLocalFilters(resetFiltersState);
    onFilterChange(resetFiltersState);
  };

  const filtersCount =
    (filters.venueType ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.location?.city || filters.location?.state || filters.location?.zipcode
      ? 1
      : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-3">
      <div className="flex flex-col md:flex-row gap-3">
        <SearchInput value={filters.searchQuery} onChange={handleSearchChange} />

        <div className="flex gap-2 flex-wrap">
          {isDesktop && (
            <SortingSelect value={filters.sortBy} onChange={handleSortChange} />
          )}

          {isDesktop ? (
            <DesktopFiltersPanel
              localFilters={localFilters}
              onFilterChange={handleFilterChange}
              onLocationChange={handleLocationChange}
              onMaxDistanceChange={handleMaxDistanceChange}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
          ) : (
            <MobileFiltersDrawer
              filters={filters}
              localFilters={localFilters}
              onFilterChange={handleFilterChange}
              onLocationChange={handleLocationChange}
              onMaxDistanceChange={handleMaxDistanceChange}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
              filtersCount={filtersCount}
              sortByValue={filters.sortBy}
              onSortChange={handleSortChange}
            />
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mt-2">
        {resultsCount} {resultsCount === 1 ? "resultado encontrado" : "resultados encontrados"}
      </div>
    </div>
  );
};

export default VenueFilters;
