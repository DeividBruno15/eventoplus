
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { VenueForm } from "./VenueForm";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Venue {
  id: string;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const UserVenues = () => {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteVenueId, setDeleteVenueId] = useState<string | null>(null);

  const fetchVenues = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_venues")
        .select("*")
        .eq("user_id", user.id)
        .order("name");
      
      if (error) throw error;
      
      setVenues(data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      toast.error("Falha ao carregar locais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user]);

  const handleDeleteVenue = async () => {
    if (!deleteVenueId) return;
    
    try {
      const { error } = await supabase
        .from("user_venues")
        .delete()
        .eq("id", deleteVenueId);
      
      if (error) throw error;
      
      // Update local state
      setVenues(venues.filter(venue => venue.id !== deleteVenueId));
      toast.success("Local removido com sucesso");
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error("Erro ao remover local");
    } finally {
      setDeleteVenueId(null);
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    fetchVenues();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Meus Locais</CardTitle>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          variant="default"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Adicionar Local
        </Button>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
          </div>
        ) : venues.length > 0 ? (
          <div className="space-y-3">
            {venues.map((venue) => (
              <div 
                key={venue.id} 
                className="p-4 rounded-md border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{venue.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${venue.street}, ${venue.number} - ${venue.neighborhood}, ${venue.city}/${venue.state}`}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteVenueId(venue.id)}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir local</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum local cadastrado</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
            >
              Adicionar meu primeiro local
            </Button>
          </div>
        )}
      </CardContent>

      {/* Add venue dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Local</DialogTitle>
            <DialogDescription>
              Preencha os dados do local para cadastrá-lo em sua conta
            </DialogDescription>
          </DialogHeader>
          <VenueForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteVenueId} onOpenChange={(open) => !open && setDeleteVenueId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Local</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este local? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteVenue}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
