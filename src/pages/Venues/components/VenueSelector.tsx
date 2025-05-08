
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { useFormContext } from "react-hook-form";
import { VenueFormValues } from "./VenueFormSchema";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VenueForm } from "@/components/profile/VenueForm";

interface UserVenue {
  id: string;
  name: string;
}

interface VenueSelectorProps {
  onVenueSelection?: (venueId: string) => void;
}

const VenueSelector = ({ onVenueSelection }: VenueSelectorProps) => {
  const { user } = useAuth();
  const { setValue } = useFormContext<VenueFormValues>();
  const [venues, setVenues] = useState<UserVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const fetchVenues = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_venues")
        .select("id, name")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setVenues(data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVenues();
  }, [user]);
  
  const handleVenueSelect = (venueId: string) => {
    setValue("venue_id", venueId);
    if (onVenueSelection) {
      onVenueSelection(venueId);
    }
  };
  
  const handleVenueCreated = () => {
    fetchVenues();
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Local</h3>
          <p className="text-sm text-muted-foreground">
            Selecione o local para este anúncio
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Novo Local
        </Button>
      </div>
      
      <Select onValueChange={handleVenueSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            isLoading 
              ? "Carregando..." 
              : venues.length ? "Selecione um local" : "Nenhum local cadastrado"
          } />
        </SelectTrigger>
        <SelectContent>
          {venues.map((venue) => (
            <SelectItem key={venue.id} value={venue.id}>
              {venue.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Local</DialogTitle>
          </DialogHeader>
          <VenueForm 
            onSuccess={handleVenueCreated}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenueSelector;
