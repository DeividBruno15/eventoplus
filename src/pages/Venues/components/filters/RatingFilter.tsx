
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RATING_OPTIONS } from '../../constants/filterOptions';
import { Star } from 'lucide-react';

interface RatingFilterProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ value, onChange }) => {
  // Get current rating label
  const getCurrentRatingLabel = () => {
    if (!value || value === 'any') return 'Qualquer avaliação';
    const option = RATING_OPTIONS.find(o => o.value === value);
    return option ? option.label : 'Qualquer avaliação';
  };
  
  return (
    <Select 
      value={value || 'any'}
      onValueChange={onChange}
    >
      <SelectTrigger className="h-8 text-sm w-full">
        <div className="flex items-center">
          <SelectValue placeholder="Avaliação" />
          {value && value !== 'any' && (
            <Star className="h-3.5 w-3.5 ml-1 text-yellow-400 fill-yellow-400" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="any" className="text-sm">Qualquer avaliação</SelectItem>
        {RATING_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value} className="text-sm">
            <div className="flex items-center">
              {option.label} <Star className="h-3.5 w-3.5 ml-1 text-yellow-400 fill-yellow-400" />
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RatingFilter;
