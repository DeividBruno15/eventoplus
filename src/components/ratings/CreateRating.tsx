
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { sendRatingNotification } from '@/hooks/useEventNotifications';

interface CreateRatingProps {
  userId: string;
  eventId?: string;
  onSuccess?: () => void;
}

export const CreateRating = ({ userId, eventId, onSuccess }: CreateRatingProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma avaliação.",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, escolha uma classificação de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva um comentário para sua avaliação.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Step 1: Create the rating in the database
      const { data: ratingData, error } = await supabase
        .from('ratings')
        .insert({
          user_id: userId,
          reviewer_id: user.id,
          rating,
          comment,
          event_id: eventId,
        })
        .select('*, reviewer:reviewer_id(first_name, last_name)')
        .single();
        
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Erro",
            description: "Você já avaliou este usuário para este evento.",
            variant: "destructive",
          });
        } else {
          console.error('Error creating rating:', error);
          toast({
            title: "Erro",
            description: "Não foi possível enviar sua avaliação. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
        return;
      }
      
      // Step 2: Fetch the reviewer's name for the notification
      const reviewerName = ratingData?.reviewer?.first_name || 'Alguém';
      
      // Step 3: Send a notification to the rated user using our centralized function
      await sendRatingNotification(userId, rating, reviewerName);
      
      toast({
        title: "Sucesso",
        description: "Sua avaliação foi enviada com sucesso!",
      });
      
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate an array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <p className="text-sm font-medium mb-2">Classificação:</p>
        <div className="flex gap-1">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={`
                  ${
                    (hoveredRating ? star <= hoveredRating : star <= rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }
                  transition-colors
                `}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Comment */}
      <div>
        <label htmlFor="comment" className="text-sm font-medium">
          Comentário:
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência..."
          className="mt-1"
          rows={4}
        />
      </div>
      
      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
      </Button>
    </form>
  );
};
