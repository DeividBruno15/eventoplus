
import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { amenityOptions } from '../constants/venueFiltersConstants';

interface VenueAmenitiesFilterProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
}

const VenueAmenitiesFilter: React.FC<VenueAmenitiesFilterProps> = ({
  selectedAmenities,
  onAmenitiesChange
}) => {
  const [open, setOpen] = useState(false);

  const handleAmenityToggle = (amenityValue: string) => {
    if (selectedAmenities.includes(amenityValue)) {
      onAmenitiesChange(selectedAmenities.filter(a => a !== amenityValue));
    } else {
      onAmenitiesChange([...selectedAmenities, amenityValue]);
    }
  };

  const clearAmenities = () => {
    onAmenitiesChange([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedAmenities.length > 0 ? "default" : "outline"}
          className="h-9 justify-between"
        >
          <span>Comodidades</span>
          {selectedAmenities.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-1 font-normal"
            >
              {selectedAmenities.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filtrar por comodidades</h4>
            {selectedAmenities.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={clearAmenities}
              >
                Limpar ({selectedAmenities.length})
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {amenityOptions.map((amenity) => (
              <div key={amenity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.value}`}
                  checked={selectedAmenities.includes(amenity.value)}
                  onCheckedChange={() => handleAmenityToggle(amenity.value)}
                />
                <Label
                  htmlFor={`amenity-${amenity.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VenueAmenitiesFilter;
