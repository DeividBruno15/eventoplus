
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
  return (
    <div>
      <h4 className="font-medium mb-2">Tipo de Espaço</h4>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          {VENUE_TYPES.map(type => (
            <SelectItem key={type.id} value={type.id}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VenueTypeFilter;
