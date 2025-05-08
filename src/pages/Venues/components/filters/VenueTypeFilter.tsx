
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { VENUE_TYPES } from '../../constants/filterOptions';

interface VenueTypeFilterProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const VenueTypeFilter: React.FC<VenueTypeFilterProps> = ({ value, onChange }) => {
  const currentType = VENUE_TYPES.find(type => type.id === value)?.label || 'Todos os tipos';
  
  return (
    <Select 
      value={value || 'all'}
      onValueChange={onChange}
    >
      <SelectTrigger className="h-8 text-sm w-full">
        <SelectValue placeholder="Tipo de Espaço" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="text-sm">Todos os tipos</SelectItem>
        {VENUE_TYPES.map(type => (
          <SelectItem key={type.id} value={type.id} className="text-sm">
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VenueTypeFilter;
