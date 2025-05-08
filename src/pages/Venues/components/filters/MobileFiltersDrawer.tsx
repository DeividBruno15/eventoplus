
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { FiltersState } from '../../hooks/useVenueFilters';
import VenueTypeFilter from './VenueTypeFilter';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SortingSelect from './SortingSelect';
import VenueLocationFilter from '../VenueLocationFilter';

interface MobileFiltersDrawerProps {
  filters: FiltersState;
  localFilters: FiltersState;
  onFilterChange: (field: keyof FiltersState, value: any) => void;
  onLocationChange: (location: FiltersState['location']) => void;
  onMaxDistanceChange: (distance: number) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  filtersCount: number;
  sortByValue: string;
  onSortChange: (value: string) => void;
}

const MobileFiltersDrawer: React.FC<MobileFiltersDrawerProps> = ({
  filters,
  localFilters,
  onFilterChange,
  onLocationChange,
  onMaxDistanceChange,
  applyFilters,
  resetFilters,
  filtersCount,
  sortByValue,
  onSortChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative h-9">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
          {filtersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {filtersCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="p-4 pb-2">
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>
              Encontre o espaço perfeito para seu evento
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0 space-y-4">
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
            
            <Separator className="my-2" />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Ordenar por</h4>
              <SortingSelect 
                value={sortByValue} 
                onChange={onSortChange}
              />
            </div>
          </div>
          <DrawerFooter className="p-4 pt-0">
            <Button onClick={() => { applyFilters(); setIsOpen(false); }}>
              Aplicar filtros
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={resetFilters}>
                Limpar filtros
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFiltersDrawer;
