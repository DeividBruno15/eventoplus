
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VenueRating } from '../types';
import { VenueRatingItem } from './VenueRatingItem';
import CreateVenueRating from './CreateVenueRating';
import VenueDetailedRatings from './VenueDetailedRatings';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

interface VenueRatingsSectionProps {
  venueId: string;
  ownerId: string;
  initialRatings: VenueRating[];
}

const VenueRatingsSection: React.FC<VenueRatingsSectionProps> = ({
  venueId,
  ownerId,
  initialRatings = []
}) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<VenueRating[]>(initialRatings);
  const [filter, setFilter] = useState<string>('all');
  const [isAddingRating, setIsAddingRating] = useState<boolean>(false);
  const isOwner = user?.id === ownerId;

  const handleAddRating = (newRating: VenueRating) => {
    setRatings([newRating, ...ratings]);
    setIsAddingRating(false);
  };

  const handleReply = async (ratingId: string, response: string) => {
    try {
      // Em uma aplicação real, isso seria uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedRatings = ratings.map(rating => {
        if (rating.id === ratingId) {
          return {
            ...rating,
            owner_response: {
              response,
              created_at: new Date().toISOString()
            }
          };
        }
        return rating;
      });
      
      setRatings(updatedRatings);
      toast.success('Resposta enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
      toast.error('Erro ao enviar resposta. Tente novamente.');
    }
  };

  const filteredRatings = () => {
    if (filter === 'all') return ratings;
    
    const ratingValue = parseInt(filter);
    return ratings.filter(rating => 
      Math.floor(rating.overall_rating) === ratingValue
    );
  };

  const hasUserRated = () => {
    if (!user) return false;
    return ratings.some(rating => rating.user_id === user.id);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
      
      {/* Sumário de avaliações */}
      {ratings.length > 0 && (
        <>
          <VenueDetailedRatings ratings={ratings} />
          
          <div className="flex flex-wrap items-center justify-between mt-6 mb-4">
            <div className="flex items-center space-x-3 my-2">
              <h3 className="font-medium">{ratings.length} avaliações</h3>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar avaliações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as avaliações</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {user && !isOwner && !hasUserRated() && !isAddingRating && (
              <Button 
                onClick={() => setIsAddingRating(true)}
                size="sm"
              >
                Escrever avaliação
              </Button>
            )}
          </div>
        </>
      )}
      
      {/* Formulário para adicionar avaliação */}
      {isAddingRating && (
        <div className="mb-6">
          <CreateVenueRating 
            venueId={venueId}
            onSuccess={handleAddRating}
            onCancel={() => setIsAddingRating(false)}
          />
        </div>
      )}
      
      {/* Lista de avaliações */}
      <div className="space-y-4">
        {filteredRatings().length > 0 ? (
          filteredRatings().map(rating => (
            <VenueRatingItem 
              key={rating.id} 
              rating={rating}
              isOwner={isOwner}
              onReply={handleReply}
            />
          ))
        ) : (
          <div className="text-center py-8 border rounded-lg">
            {ratings.length > 0 ? (
              <p className="text-gray-500">
                Nenhuma avaliação encontrada com o filtro selecionado.
              </p>
            ) : (
              <>
                <p className="text-gray-500 mb-4">
                  Este local ainda não possui avaliações.
                </p>
                
                {user && !isOwner && !isAddingRating && (
                  <Button onClick={() => setIsAddingRating(true)}>
                    Seja o primeiro a avaliar
                  </Button>
                )}
                
                {!user && (
                  <p className="text-sm text-gray-400">
                    Faça login para avaliar este local
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueRatingsSection;
