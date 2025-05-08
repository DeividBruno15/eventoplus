
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FavoriteButton from "./FavoriteButton";

interface VenueActionsProps {
  isOwner: boolean;
  venueId: string;
  userId: string | undefined;
  venueUserId: string;
  venueName?: string;
}

export const VenueActions = ({ 
  isOwner, 
  venueId,
  userId,
  venueUserId,
  venueName = '' 
}) => {
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
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/venues")}
          className="flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        {/* Adicionar o botão de favoritos */}
        {venueId && venueName && !isOwner && (
          <FavoriteButton 
            venueId={venueId} 
            venueName={venueName}
            size="sm"
          />
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Botões de ação para proprietários */}
        {isOwner && (
          <>
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
          </>
        )}
        
        {/* Botões de ação para não proprietários */}
        {!isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/venues/share/${venueId}`)}
          >
            Compartilhar
          </Button>
        )}
      </div>
    </div>
  );
};
