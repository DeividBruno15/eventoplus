
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from './StarRating';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VenueRating } from '../types';

interface VenueRatingItemProps {
  rating: VenueRating;
  isOwner: boolean;
  onReply: (ratingId: string, response: string) => Promise<void>;
}

export const VenueRatingItem: React.FC<VenueRatingItemProps> = ({
  rating,
  isOwner,
  onReply
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(rating.id, replyText);
      setIsReplying(false);
      setReplyText('');
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return dateString;
    }
  };

  // Extrair iniciais do nome para o avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={rating.user_avatar} alt={rating.user_name} />
              <AvatarFallback>{getInitials(rating.user_name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{rating.user_name || 'Usuário'}</p>
              <div className="flex items-center gap-2">
                <StarRating value={rating.overall_rating} readOnly size="sm" />
                <span className="text-sm text-muted-foreground">
                  {formatDate(rating.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-gray-700">{rating.comment}</p>
        
        {/* Detalhes das avaliações específicas */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
          {rating.location_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Localização</span>
              <StarRating value={rating.location_rating} readOnly size="sm" />
            </div>
          )}
          
          {rating.value_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Custo-benefício</span>
              <StarRating value={rating.value_rating} readOnly size="sm" />
            </div>
          )}
          
          {rating.service_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Atendimento</span>
              <StarRating value={rating.service_rating} readOnly size="sm" />
            </div>
          )}
          
          {rating.cleanliness_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Limpeza</span>
              <StarRating value={rating.cleanliness_rating} readOnly size="sm" />
            </div>
          )}
          
          {rating.amenities_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Comodidades</span>
              <StarRating value={rating.amenities_rating} readOnly size="sm" />
            </div>
          )}
        </div>
        
        {/* Resposta do proprietário, se houver */}
        {rating.owner_response && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium">Resposta do proprietário</p>
            <p className="text-sm mt-1">{rating.owner_response.response}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(rating.owner_response.created_at)}
            </p>
          </div>
        )}
        
        {/* Interface de resposta */}
        {isReplying && (
          <div className="mt-4 space-y-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva sua resposta..."
              className="resize-none"
            />
          </div>
        )}
      </CardContent>
      
      {isOwner && !rating.owner_response && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          {isReplying ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsReplying(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleReply}
                disabled={!replyText.trim() || isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Responder"}
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsReplying(true)}
            >
              Responder
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
