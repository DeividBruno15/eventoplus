
import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { FiltersState } from '../hooks/useVenueFilters';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import DesktopFiltersPanel from './filters/DesktopFiltersPanel';
import MobileFiltersDrawer from './filters/MobileFiltersDrawer';
import SortingSelect from './filters/SortingSelect';

interface VenueFiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
  resultsCount: number;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({
  filters,
  onFilterChange,
  resultsCount
}) => {
  const { isDesktop } = useBreakpoint('md');
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters);
  const [searchQuery, setSearchQuery] = useState<string>(filters.searchQuery || '');
  
  // Count active filters for badge indicator
  const filtersCount = 
    (filters.venueType ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.location?.city || filters.location?.state || filters.location?.zipcode ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);
  
  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update filters after a short delay
    const timeoutId = setTimeout(() => {
      onFilterChange({
        ...filters,
        searchQuery: value
      });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Handle individual filter changes
  const handleFilterChange = (field: keyof FiltersState, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle location filter changes specifically
  const handleLocationChange = (location: FiltersState['location']) => {
    setLocalFilters(prev => ({
      ...prev,
      location
    }));
  };
  
  // Handle max distance filter changes
  const handleMaxDistanceChange = (distance: number) => {
    setLocalFilters(prev => ({
      ...prev,
      maxDistance: distance
    }));
  };
  
  // Apply all filters from local state
  const applyFilters = () => {
    onFilterChange(localFilters);
  };
  
  // Reset all filters to default values
  const resetFilters = () => {
    const resetState: FiltersState = {
      searchQuery: searchQuery, // Keep search query
      venueType: undefined,
      minRating: undefined,
      priceRange: [0, 10000] as [number, number], // Explicitly cast as tuple type
      sortBy: filters.sortBy, // Keep sort selection
      location: undefined,
      maxDistance: 50
    };
    
    setLocalFilters(resetState);
    onFilterChange(resetState);
  };
  
  // Handle sort selection changes
  const handleSortChange = (value: string) => {
    const updatedFilters: FiltersState = {
      ...filters,
      sortBy: value
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por tipo, localização, etc..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
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
          
          {isDesktop && (
            <SortingSelect 
              value={filters.sortBy} 
              onChange={handleSortChange} 
            />
          )}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {resultsCount} {resultsCount === 1 ? 'espaço encontrado' : 'espaços encontrados'}
      </div>
    </div>
  );
};

export default VenueFilters;
