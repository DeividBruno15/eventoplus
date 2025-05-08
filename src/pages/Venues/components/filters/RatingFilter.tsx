
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RATING_OPTIONS } from '../../constants/filterOptions';

interface RatingFilterProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <h4 className="font-medium mb-1 text-sm">Avaliação mínima</h4>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Qualquer avaliação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Qualquer avaliação</SelectItem>
          {RATING_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RatingFilter;
