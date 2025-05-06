
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RatingWithUser } from '@/types/ratings';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface RatingsListProps {
  ratings: RatingWithUser[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const RatingsList = ({ 
  ratings,
  isLoading = false,
  emptyMessage = "Nenhuma avaliação disponível"
}: RatingsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                {rating.reviewer_avatar ? (
                  <AvatarImage src={rating.reviewer_avatar} alt={rating.reviewer_name} />
                ) : (
                  <AvatarFallback>
                    {rating.reviewer_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{rating.reviewer_name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(rating.created_at), { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
                <div className="flex mb-2 items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                  {rating.event_id && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Evento verificado
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{rating.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
