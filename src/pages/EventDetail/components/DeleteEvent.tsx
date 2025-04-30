
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
import { deleteEventById } from '@/utils/events/eventDeletion';

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
      console.log("Iniciando exclusão do evento:", event.id);
      
      const success = await deleteEventById(event.id);
      
      if (!success) {
        setDeleting(false);
        return;
      }
      
      // Fechando o dialog
      setIsOpen(false);
      setDeleting(false);
      
      // Utilizando um pequeno atraso para garantir que todas as operações assíncronas foram concluídas
      setTimeout(() => {
        // Redirecionando para a página de eventos com um parâmetro de atualização
        navigate('/events?refresh=true', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(`Erro ao excluir evento: ${error.message}`);
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
              onClick={(e) => {
                e.preventDefault(); // Prevent default to handle manually
                handleDelete();
              }}
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
