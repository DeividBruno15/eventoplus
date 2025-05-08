
import React from 'react';
import { Button } from "@/components/ui/button";
import { FiltersState } from '../../hooks/useVenueFilters';
import VenueTypeFilter from './VenueTypeFilter';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';
import VenueLocationFilter from '../VenueLocationFilter';
import { Filter } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

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
  // Determine active filters count for the indicator badge
  const filtersCount = 
    (localFilters.venueType ? 1 : 0) +
    (localFilters.minRating ? 1 : 0) +
    (localFilters.location?.city || localFilters.location?.state || localFilters.location?.zipcode ? 1 : 0) +
    (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000 ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 relative h-9">
          <Filter className="h-4 w-4" />
          Filtros
          {filtersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {filtersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Espaço</h4>
            <VenueTypeFilter 
              value={localFilters.venueType} 
              onChange={(value) => onFilterChange('venueType', value)} 
            />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Avaliação mínima</h4>
            <RatingFilter 
              value={localFilters.minRating} 
              onChange={(value) => onFilterChange('minRating', value)} 
            />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Faixa de preço</h4>
            <PriceRangeFilter 
              value={localFilters.priceRange} 
              onChange={(value) => onFilterChange('priceRange', value)} 
            />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Localização</h4>
            <VenueLocationFilter 
              location={localFilters.location}
              maxDistance={localFilters.maxDistance}
              onLocationChange={onLocationChange}
              onMaxDistanceChange={onMaxDistanceChange}
              isCompact={true}
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFilters}
            >
              Limpar
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                applyFilters();
              }}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DesktopFiltersPanel;
