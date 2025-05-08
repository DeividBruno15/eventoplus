
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface RatingsFilterProps {
  filter: string;
  onFilterChange: (value: string) => void;
  ratingsCount: number;
  ratingsDistribution?: Record<string, number>;
}

const RatingsFilter: React.FC<RatingsFilterProps> = ({
  filter,
  onFilterChange,
  ratingsCount,
  ratingsDistribution = {}
}) => {
  // Calcular a distribuição se fornecida
  const hasDistribution = Object.keys(ratingsDistribution).length > 0;
  
  // Renderiza as estrelas para cada opção
  const renderStars = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" 
        />
      ));
  };
  
  // Função para calcular a largura da barra baseada na percentagem
  const getBarWidth = (count: number) => {
    if (!hasDistribution || ratingsCount === 0) return '0%';
    const percentage = Math.round((count / ratingsCount) * 100);
    return `${percentage}%`;
  };

  return (
    <div className="space-y-3 my-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium text-base flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          <span>
            {ratingsCount} {ratingsCount === 1 ? 'avaliação' : 'avaliações'}
          </span>
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
                <div className="flex items-center gap-1.5">
                  {renderStars(rating)}
                  <span className="ml-1">
                    ({hasDistribution ? ratingsDistribution[rating] || 0 : ''})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Adicionar visualização gráfica de distribuição de avaliações */}
      {hasDistribution && (
        <div className="space-y-2 pt-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm">{rating}</span>
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: getBarWidth(ratingsDistribution[rating] || 0) }}
                />
              </div>
              
              <span className="text-sm text-muted-foreground w-10 text-right">
                {ratingsDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Badge para mostrar filtros ativos */}
      {filter !== 'all' && (
        <Badge variant="outline" className="mt-2">
          Filtro: {filter} {filter === '1' ? 'estrela' : 'estrelas'}
          <button 
            className="ml-1 hover:text-destructive"
            onClick={() => onFilterChange('all')}
          >
            ✕
          </button>
        </Badge>
      )}
    </div>
  );
};

export default RatingsFilter;
