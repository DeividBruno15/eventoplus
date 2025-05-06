
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingWithUser } from '@/types/ratings';

interface RatingSummaryProps {
  ratings: RatingWithUser[];
  averageRating: number;
  totalRatings: number;
}

export const RatingSummary = ({ ratings, averageRating, totalRatings }: RatingSummaryProps) => {
  // Calcular contagem de cada classificação
  const ratingCounts = [5, 4, 3, 2, 1].map(star => {
    const count = ratings.filter(r => Math.floor(r.rating) === star).length;
    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificações e avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : i < averageRating 
                        ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                        : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{totalRatings} avaliações</div>
          </div>
          
          <div className="flex-1">
            <div className="space-y-2">
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <div className="w-2">{star}</div>
                  <Progress value={percentage} className="h-2 flex-1" />
                  <div className="text-xs text-muted-foreground w-8 text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
