
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EventsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const EventsSearch = ({ value, onChange }: EventsSearchProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Buscar eventos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4"
      />
    </div>
  );
};
