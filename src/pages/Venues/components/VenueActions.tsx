
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VenueActionsProps {
  isOwner: boolean;
  venueId: string;
  userId: string | undefined;
  venueUserId: string;
}

export const VenueActions = ({ isOwner, venueId, userId, venueUserId }: VenueActionsProps) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = async () => {
    if (!venueId) return;
    
    // Check if the current user is the owner
    if (userId !== venueUserId) {
      toast.error("Você não tem permissão para excluir este anúncio");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('venue_announcements')
        .delete()
        .eq('id', venueId);
      
      if (error) throw error;
      
      toast.success("Anúncio excluído com sucesso");
      navigate('/venues');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={() => navigate('/venues')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para anúncios
      </Button>
      
      {isOwner && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/venues/edit/${venueId}`)}
          >
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                Confirmar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash className="h-4 w-4 mr-1" /> Excluir
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
