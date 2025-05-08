
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RatingsFilterProps {
  filter: string;
  onFilterChange: (value: string) => void;
  ratingsCount: number;
}

const RatingsFilter: React.FC<RatingsFilterProps> = ({
  filter,
  onFilterChange,
  ratingsCount
}) => {
  return (
    <div className="flex items-center space-x-3 my-2">
      <h3 className="font-medium">{ratingsCount} avaliações</h3>
      <Select
        value={filter}
        onValueChange={onFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar avaliações" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as avaliações</SelectItem>
          <SelectItem value="5">5 estrelas</SelectItem>
          <SelectItem value="4">4 estrelas</SelectItem>
          <SelectItem value="3">3 estrelas</SelectItem>
          <SelectItem value="2">2 estrelas</SelectItem>
          <SelectItem value="1">1 estrela</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RatingsFilter;
