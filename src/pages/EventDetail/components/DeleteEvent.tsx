
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DeleteEventProps {
  event: Event;
  userId: string | undefined;
}

export const DeleteEvent = ({ event, userId }: DeleteEventProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!event || !userId || event.contractor_id !== userId) {
      toast.error("Apenas o criador do evento pode excluí-lo");
      return;
    }
    
    try {
      setDeleting(true);
      
      // Delete all applications for this event first
      const { error: applicationsError } = await supabase
        .from('event_applications')
        .delete()
        .eq('event_id', event.id);
        
      if (applicationsError) {
        console.error("Error deleting applications:", applicationsError);
      }
      
      // Delete the event itself
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);
        
      if (error) throw error;
      
      toast.success("Evento excluído com sucesso");
      
      // Navigate to events page immediately
      navigate('/events');
      
    } catch (error: any) {
      toast.error(`Erro ao excluir evento: ${error.message}`);
      console.error("Delete error:", error);
    } finally {
      setIsOpen(false);
      setDeleting(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir evento
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
