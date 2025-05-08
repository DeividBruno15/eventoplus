
import React from 'react';
import { Button } from "@/components/ui/button";
import { FiltersState } from '../../hooks/useVenueFilters';
import VenueTypeFilter from './VenueTypeFilter';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';
import VenueLocationFilter from '../VenueLocationFilter';

interface DesktopFiltersPanelProps {
  localFilters: FiltersState;
  onFilterChange: (field: keyof FiltersState, value: any) => void;
  onLocationChange: (location: FiltersState['location']) => void;
  onMaxDistanceChange: (distance: number) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const DesktopFiltersPanel: React.FC<DesktopFiltersPanelProps> = ({
  localFilters,
  onFilterChange,
  onLocationChange,
  onMaxDistanceChange,
  applyFilters,
  resetFilters
}) => {
  return (
    <div className="border p-4 rounded-md flex-1 hidden md:block">
      <h3 className="font-medium mb-4">Filtros</h3>
      <div className="space-y-4">
        <VenueTypeFilter 
          value={localFilters.venueType} 
          onChange={(value) => onFilterChange('venueType', value)} 
        />
        
        <RatingFilter 
          value={localFilters.minRating} 
          onChange={(value) => onFilterChange('minRating', value)} 
        />
        
        <div>
          <h4 className="font-medium mb-2">Localização</h4>
          <VenueLocationFilter 
            location={localFilters.location}
            maxDistance={localFilters.maxDistance}
            onLocationChange={onLocationChange}
            onMaxDistanceChange={onMaxDistanceChange}
          />
        </div>
        
        <PriceRangeFilter 
          value={localFilters.priceRange} 
          onChange={(value) => onFilterChange('priceRange', value)} 
        />
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetFilters}
        >
          Limpar filtros
        </Button>
        <Button 
          size="sm"
          onClick={applyFilters}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

export default DesktopFiltersPanel;
