
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
import { useVenueRatings } from '../hooks/useVenueRatings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface VenueRatingsSectionProps {
  venueId: string;
  ownerId: string;
  userIsAuthenticated?: boolean;  // Adicionando como propriedade opcional
}

const VenueRatingsSection: React.FC<VenueRatingsSectionProps> = ({
  venueId,
  ownerId,
  userIsAuthenticated = false,  // Valor padrão
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  const [isAddingRating, setIsAddingRating] = useState<boolean>(false);
  
  // Usar o hook para buscar avaliações
  const { ratings, loading, addRating, updateRating } = useVenueRatings(venueId);
  
  // Usar userIsAuthenticated se fornecido, caso contrário usar o valor do hook
  const isAuthenticated = user ? true : userIsAuthenticated;
  const isOwner = user?.id === ownerId;

  const handleAddRating = (newRating: VenueRating) => {
    addRating(newRating);
    setIsAddingRating(false);
  };

  const handleReply = async (ratingId: string, response: string) => {
    try {
      const { error } = await supabase
        .from('venue_ratings')
        .update({
          owner_response: {
            response,
            created_at: new Date().toISOString()
          }
        })
        .eq('id', ratingId);
        
      if (error) throw error;
      
      // Atualizar avaliação no estado local
      updateRating(ratingId, {
        owner_response: {
          response,
          created_at: new Date().toISOString()
        }
      });
      
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
      {ratings.length > 0 && !loading && (
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
            
            {isAuthenticated && !isOwner && !hasUserRated() && !isAddingRating && (
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
        {!loading ? (
          filteredRatings().length > 0 ? (
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
                  
                  {isAuthenticated && !isOwner && !isAddingRating && (
                    <Button onClick={() => setIsAddingRating(true)}>
                      Seja o primeiro a avaliar
                    </Button>
                  )}
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-400">
                      Faça login para avaliar este local
                    </p>
                  )}
                </>
              )}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueRatingsSection;
