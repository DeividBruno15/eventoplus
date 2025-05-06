
import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { VenueRating } from '../types';

interface VenueDetailedRatingsProps {
  ratings: VenueRating[];
}

const VenueDetailedRatings: React.FC<VenueDetailedRatingsProps> = ({ ratings }) => {
  // Calcular médias para cada critério
  const calculateAverages = () => {
    if (!ratings || ratings.length === 0) return {
      overall: 0,
      location: 0,
      value: 0,
      service: 0,
      cleanliness: 0,
      amenities: 0,
      count: 0
    };

    const sum = {
      overall: 0,
      location: 0,
      value: 0,
      service: 0,
      cleanliness: 0,
      amenities: 0,
      count: ratings.length
    };

    ratings.forEach(rating => {
      sum.overall += rating.overall_rating || 0;
      sum.location += rating.location_rating || 0;
      sum.value += rating.value_rating || 0;
      sum.service += rating.service_rating || 0;
      sum.cleanliness += rating.cleanliness_rating || 0;
      sum.amenities += rating.amenities_rating || 0;
    });

    const validRatings = (key: keyof typeof sum) => 
      ratings.filter(r => r[`${key}_rating` as keyof VenueRating]).length || 1;

    return {
      overall: sum.overall / sum.count,
      location: sum.location / validRatings('location'),
      value: sum.value / validRatings('value'),
      service: sum.service / validRatings('service'),
      cleanliness: sum.cleanliness / validRatings('cleanliness'),
      amenities: sum.amenities / validRatings('amenities'),
      count: sum.count
    };
  };

  const averages = calculateAverages();

  // Renderizar estrelas para uma pontuação
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  // Formatar número para exibição (ex: 4.7)
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="flex">
          {renderStars(averages.overall)}
        </div>
        <span className="text-xl font-bold">{formatRating(averages.overall)}</span>
        <span className="text-gray-500">({averages.count} avaliações)</span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span>Localização</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatRating(averages.location)}</span>
              <div className="flex">
                {renderStars(averages.location)}
              </div>
            </div>
          </div>
          <Progress value={averages.location * 20} className="h-2" />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span>Custo-benefício</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatRating(averages.value)}</span>
              <div className="flex">
                {renderStars(averages.value)}
              </div>
            </div>
          </div>
          <Progress value={averages.value * 20} className="h-2" />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span>Atendimento</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatRating(averages.service)}</span>
              <div className="flex">
                {renderStars(averages.service)}
              </div>
            </div>
          </div>
          <Progress value={averages.service * 20} className="h-2" />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span>Limpeza</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatRating(averages.cleanliness)}</span>
              <div className="flex">
                {renderStars(averages.cleanliness)}
              </div>
            </div>
          </div>
          <Progress value={averages.cleanliness * 20} className="h-2" />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span>Comodidades</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatRating(averages.amenities)}</span>
              <div className="flex">
                {renderStars(averages.amenities)}
              </div>
            </div>
          </div>
          <Progress value={averages.amenities * 20} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default VenueDetailedRatings;
