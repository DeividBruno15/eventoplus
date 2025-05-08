
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SORT_OPTIONS } from '../../constants/filterOptions';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SortingSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SortingSelect: React.FC<SortingSelectProps> = ({ value, onChange }) => {
  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = SORT_OPTIONS.find(option => option.value === value);
    return option ? option.label : 'Ordenar por';
  };

  // Get icon based on sort type
  const getSortIcon = () => {
    if (value === 'priceAsc') return <ArrowUp className="h-3.5 w-3.5 ml-1" />;
    if (value === 'priceDesc') return <ArrowDown className="h-3.5 w-3.5 ml-1" />;
    return null;
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] h-9 text-sm">
        <div className="flex items-center justify-between overflow-hidden">
          <SelectValue placeholder="Ordenar por" />
          {getSortIcon()}
        </div>
      </SelectTrigger>
      <SelectContent sideOffset={5} align="end">
        <SelectGroup>
          {SORT_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortingSelect;
