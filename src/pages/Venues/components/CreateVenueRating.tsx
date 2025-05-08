
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from './StarRating';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRatingNotifications } from '@/hooks/useRatingNotifications';

interface CreateVenueRatingProps {
  venueId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateVenueRating: React.FC<CreateVenueRatingProps> = ({ 
  venueId, 
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { sendRatingNotification } = useRatingNotifications();
  
  const [overallRating, setOverallRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [amenitiesRating, setAmenitiesRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma avaliação.",
        variant: "destructive"
      });
      return;
    }
    
    if (overallRating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, dê uma avaliação geral para o local.",
        variant: "destructive"
      });
      return;
    }
    
    if (comment.trim().length < 10) {
      toast({
        title: "Comentário muito curto",
        description: "Por favor, escreva um comentário mais detalhado (mínimo 10 caracteres).",
        variant: "destructive" 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Obter informações do venue para a notificação
      const { data: venueData, error: venueError } = await supabase
        .from('venue_announcements')
        .select('title, user_id')
        .eq('id', venueId)
        .single();
        
      if (venueError) {
        throw venueError;
      }
      
      // Enviar a avaliação
      const { error } = await supabase
        .from('venue_ratings')
        .insert({
          venue_id: venueId,
          user_id: user.id,
          overall_rating: overallRating,
          location_rating: locationRating || null,
          value_rating: valueRating || null,
          cleanliness_rating: cleanlinessRating || null,
          service_rating: serviceRating || null,
          amenities_rating: amenitiesRating || null,
          comment
        });
        
      if (error) {
        throw error;
      }
      
      // Enviar notificação ao proprietário
      if (user.id !== venueData.user_id) {
        // Obter nome do usuário
        const { data: userData } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        const reviewerName = userData ? 
          `${userData.first_name} ${userData.last_name}` : 
          'Um usuário';
          
        await sendRatingNotification(
          venueData.user_id,
          overallRating,
          venueData.title,
          reviewerName,
          venueId
        );
      }
      
      toast({
        title: "Avaliação enviada",
        description: "Sua avaliação foi registrada com sucesso!"
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message || "Ocorreu um erro ao enviar sua avaliação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Avaliação Geral*</label>
        <StarRating 
          value={overallRating} 
          onChange={setOverallRating} 
          size="lg"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Localização</label>
          <StarRating 
            value={locationRating} 
            onChange={setLocationRating}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Custo-benefício</label>
          <StarRating 
            value={valueRating} 
            onChange={setValueRating}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Limpeza</label>
          <StarRating 
            value={cleanlinessRating} 
            onChange={setCleanlinessRating}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Atendimento</label>
          <StarRating 
            value={serviceRating} 
            onChange={setServiceRating}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Comodidades</label>
          <StarRating 
            value={amenitiesRating} 
            onChange={setAmenitiesRating}
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Comentário*</label>
        <Textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com este local..."
          rows={5}
          required
          minLength={10}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar avaliação"}
        </Button>
      </div>
    </form>
  );
};

export default CreateVenueRating;
