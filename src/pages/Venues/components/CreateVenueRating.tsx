
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { VenueRating } from '../types';

interface CreateVenueRatingProps {
  venueId: string;
  onSuccess: (rating: VenueRating) => void;
  onCancel?: () => void;
}

const CreateVenueRating: React.FC<CreateVenueRatingProps> = ({
  venueId,
  onSuccess,
  onCancel
}) => {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [locationRating, setLocationRating] = useState<number>(0);
  const [valueRating, setValueRating] = useState<number>(0);
  const [serviceRating, setServiceRating] = useState<number>(0);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(0);
  const [amenitiesRating, setAmenitiesRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});

  const handleStarClick = (rating: number, type: string) => {
    switch(type) {
      case 'overall':
        setOverallRating(rating);
        break;
      case 'location':
        setLocationRating(rating);
        break;
      case 'value':
        setValueRating(rating);
        break;
      case 'service':
        setServiceRating(rating);
        break;
      case 'cleanliness':
        setCleanlinessRating(rating);
        break;
      case 'amenities':
        setAmenitiesRating(rating);
        break;
    }
  };

  const handleMouseEnter = (rating: number, type: string) => {
    setHoveredRating({
      ...hoveredRating,
      [type]: rating
    });
  };

  const handleMouseLeave = (type: string) => {
    setHoveredRating({
      ...hoveredRating,
      [type]: 0
    });
  };

  const renderStars = (rating: number, type: string) => {
    const currentRating = {
      overall: overallRating,
      location: locationRating,
      value: valueRating,
      service: serviceRating,
      cleanliness: cleanlinessRating,
      amenities: amenitiesRating
    }[type];

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            i <= (hoveredRating[type] || currentRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleStarClick(i, type)}
          onMouseEnter={() => handleMouseEnter(i, type)}
          onMouseLeave={() => handleMouseLeave(type)}
        />
      );
    }
    return stars;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (overallRating === 0) {
      toast.error('Por favor, selecione uma avaliação geral');
      return;
    }
    
    if (comment.trim() === '') {
      toast.error('Por favor, adicione um comentário à sua avaliação');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Criando um mock de avaliação para simulação
      // Em uma implementação real, isso seria um POST para uma API
      const newRating: VenueRating = {
        id: `temp-${Date.now()}`,
        venue_id: venueId,
        user_id: 'mock-user-id',
        overall_rating: overallRating,
        location_rating: locationRating || undefined,
        value_rating: valueRating || undefined,
        service_rating: serviceRating || undefined,
        cleanliness_rating: cleanlinessRating || undefined,
        amenities_rating: amenitiesRating || undefined,
        comment: comment,
        created_at: new Date().toISOString(),
        user: {
          first_name: 'Usuário',
          last_name: 'Atual'
        }
      };
      
      // Simulação de uma chamada assíncrona
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Avaliação enviada com sucesso!');
      onSuccess(newRating);
      
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4">Avalie este local</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Avaliação geral */}
          <div>
            <label className="block mb-2 font-medium">Avaliação geral</label>
            <div className="flex">
              {renderStars(overallRating, 'overall')}
            </div>
            {overallRating === 0 && (
              <p className="text-sm text-red-500 mt-1">Esta avaliação é obrigatória</p>
            )}
          </div>
          
          {/* Avaliações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">Localização</label>
              <div className="flex">
                {renderStars(locationRating, 'location')}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Custo-benefício</label>
              <div className="flex">
                {renderStars(valueRating, 'value')}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Atendimento</label>
              <div className="flex">
                {renderStars(serviceRating, 'service')}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Limpeza</label>
              <div className="flex">
                {renderStars(cleanlinessRating, 'cleanliness')}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm">Comodidades</label>
              <div className="flex">
                {renderStars(amenitiesRating, 'amenities')}
              </div>
            </div>
          </div>
          
          {/* Comentário */}
          <div>
            <label htmlFor="comment" className="block mb-2 font-medium">
              Seu comentário
            </label>
            <Textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência neste local..."
              className="w-full"
            />
            {comment.trim() === '' && (
              <p className="text-sm text-red-500 mt-1">Este campo é obrigatório</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={overallRating === 0 || comment.trim() === '' || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateVenueRating;
