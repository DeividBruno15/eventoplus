
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EventsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const EventsSearch = ({ searchQuery, onSearchChange }: EventsSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar eventos por título, local ou data..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 h-10 bg-white border-gray-200"
      />
    </div>
  );
};
