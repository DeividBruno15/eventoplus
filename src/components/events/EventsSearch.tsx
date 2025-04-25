
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const EventsSearch = ({ searchQuery, onSearchChange }: EventsSearchProps) => {
  return (
    <div className="flex space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          className="pl-10" 
          placeholder="Buscar eventos..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" /> Filtrar
      </Button>
    </div>
  );
};
