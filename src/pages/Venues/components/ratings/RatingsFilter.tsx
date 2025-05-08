
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-3 my-4">
      <h3 className="font-medium text-base">
        {ratingsCount} {ratingsCount === 1 ? 'avaliação' : 'avaliações'}
      </h3>
      
      <Select
        value={filter}
        onValueChange={onFilterChange}
      >
        <SelectTrigger className="w-[180px] h-9" aria-label="Filtrar avaliações">
          <SelectValue placeholder="Filtrar avaliações" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as avaliações</SelectItem>
          {[5, 4, 3, 2, 1].map((rating) => (
            <SelectItem key={rating} value={rating.toString()}>
              <div className="flex items-center">
                <span className="mr-2">{rating}</span>
                <Star className={`h-3.5 w-3.5 ${rating > 0 ? "fill-yellow-400 text-yellow-400" : ""}`} />
                {rating === 1 ? " estrela" : " estrelas"}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RatingsFilter;
