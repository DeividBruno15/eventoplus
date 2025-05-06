
import React, { useState } from 'react';
import { MapPinIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { brazilianStates } from '../constants/venueFiltersConstants';

interface Location {
  city?: string;
  state?: string;
  zipcode?: string;
}

interface VenueLocationFilterProps {
  location?: Location;
  maxDistance?: number;
  onLocationChange: (location: Location) => void;
  onMaxDistanceChange: (distance: number) => void;
}

const VenueLocationFilter: React.FC<VenueLocationFilterProps> = ({
  location = {},
  maxDistance = 50,
  onLocationChange,
  onMaxDistanceChange
}) => {
  const [open, setOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<Location>(location);
  const [tempDistance, setTempDistance] = useState<number>(maxDistance);
  
  const hasActiveFilter = !!(location?.city || location?.state || location?.zipcode);
  
  const handleApply = () => {
    onLocationChange(tempLocation);
    onMaxDistanceChange(tempDistance);
    setOpen(false);
  };
  
  const clearLocation = () => {
    setTempLocation({});
    onLocationChange({});
    onMaxDistanceChange(50);
    setTempDistance(50);
  };
  
  const getFilterLabel = () => {
    if (location?.city) return location.city;
    if (location?.state) {
      const stateObj = brazilianStates.find(s => s.value === location.state);
      return stateObj ? stateObj.label : location.state;
    }
    if (location?.zipcode) return `CEP: ${location.zipcode}`;
    return "Localização";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilter ? "default" : "outline"}
          className="h-9 justify-between"
        >
          <span className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {getFilterLabel()}
          </span>
          {hasActiveFilter && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-1 font-normal"
            >
              {maxDistance}km
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filtrar por localização</h4>
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={clearLocation}
              >
                Limpar filtros
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="state">Estado</Label>
              <Select
                value={tempLocation?.state || ""}
                onValueChange={(value) => setTempLocation({...tempLocation, state: value})}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os estados</SelectItem>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Digite a cidade"
                value={tempLocation?.city || ""}
                onChange={(e) => setTempLocation({...tempLocation, city: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="zipcode">CEP</Label>
              <Input
                id="zipcode"
                placeholder="00000-000"
                value={tempLocation?.zipcode || ""}
                onChange={(e) => setTempLocation({...tempLocation, zipcode: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <Label htmlFor="distance">Distância máxima</Label>
                <span className="text-sm">{tempDistance} km</span>
              </div>
              <Slider
                id="distance"
                min={1}
                max={100}
                step={1}
                value={[tempDistance]}
                onValueChange={(values) => setTempDistance(values[0])}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={handleApply}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VenueLocationFilter;
