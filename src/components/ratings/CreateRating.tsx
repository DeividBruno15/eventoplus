
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreateRatingProps {
  userId: string;
  eventId?: string;
  onSuccess?: () => void;
}

export const CreateRating = ({ userId, eventId, onSuccess }: CreateRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Erro ao enviar avaliação",
        description: "Você precisa estar logado para avaliar",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Erro ao enviar avaliação",
        description: "Selecione uma classificação de 1 a 5 estrelas",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 5) {
      toast({
        title: "Erro ao enviar avaliação",
        description: "O comentário deve ter pelo menos 5 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('ratings')
        .insert({
          user_id: userId,
          reviewer_id: user.id,
          rating,
          comment,
          event_id: eventId || null,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Avaliação enviada com sucesso",
        description: "Obrigado pelo seu feedback!",
      });

      // Limpar formulário
      setRating(0);
      setComment('');
      
      // Callback de sucesso
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message || "Ocorreu um erro ao processar sua avaliação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((index) => (
            <Star
              key={index}
              className={`w-8 h-8 cursor-pointer transition-colors ${
                index <= (hoverRating || rating) 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoverRating(index)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(index)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Compartilhe sua opinião sobre esta experiência..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || comment.trim().length < 5}
          className="w-full"
        >
          {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </CardFooter>
    </Card>
  );
};
