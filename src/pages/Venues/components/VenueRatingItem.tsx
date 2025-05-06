
import React, { useState } from 'react';
import { Star, Reply, ThumbsUp, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { VenueRating } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  const handleReplySubmit = async () => {
    if (!response.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onReply(rating.id, response);
      setIsReplying(false);
      setResponse('');
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={rating.user?.avatar_url} alt={`${rating.user?.first_name || 'Usuário'}`} />
          <AvatarFallback>
            {getInitials(rating.user?.first_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h4 className="font-semibold">
              {rating.user?.first_name} {rating.user?.last_name}
            </h4>
            <span className="text-xs text-gray-500">{formatDate(rating.created_at)}</span>
          </div>
          
          <div className="flex mt-1 mb-2">
            {renderStars(rating.overall_rating)}
          </div>

          {/* Avaliações detalhadas em lista horizontal */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs my-2">
            {rating.location_rating && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">Localização:</span>
                <span className="font-medium">{rating.location_rating}</span>
              </div>
            )}
            {rating.value_rating && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">Custo-benefício:</span>
                <span className="font-medium">{rating.value_rating}</span>
              </div>
            )}
            {rating.service_rating && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">Atendimento:</span>
                <span className="font-medium">{rating.service_rating}</span>
              </div>
            )}
            {rating.cleanliness_rating && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">Limpeza:</span>
                <span className="font-medium">{rating.cleanliness_rating}</span>
              </div>
            )}
            {rating.amenities_rating && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">Comodidades:</span>
                <span className="font-medium">{rating.amenities_rating}</span>
              </div>
            )}
          </div>

          <p className="text-gray-700 mt-1">{rating.comment}</p>
          
          <div className="flex justify-between mt-3">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-xs">Útil</span>
              </Button>
              {isOwner && !rating.owner_response && !isReplying && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsReplying(true)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  <span className="text-xs">Responder</span>
                </Button>
              )}
            </div>
            
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4 mr-1" />
              <span className="text-xs">Denunciar</span>
            </Button>
          </div>
          
          {/* Área de resposta */}
          {isReplying && (
            <div className="mt-3 border-t pt-3">
              <Textarea
                placeholder="Digite sua resposta..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[100px] mb-3"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setResponse('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!response.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Responder'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Exibir resposta se existir */}
          {rating.owner_response && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">Resposta do anunciante</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(rating.owner_response.created_at)}
                </span>
              </div>
              <p className="mt-2 text-sm">{rating.owner_response.response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
