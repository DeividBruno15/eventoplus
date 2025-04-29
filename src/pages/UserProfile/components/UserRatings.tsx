
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar?: string | null;
}

interface UserRatingsProps {
  ratings: Rating[];
}

export const UserRatings = ({ ratings }: UserRatingsProps) => {
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-500">Nenhuma avaliação no momento</h3>
        <p className="text-sm text-gray-500 mt-1">
          Este usuário ainda não possui avaliações
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ratings.map(rating => (
        <div key={rating.id} className="border-b pb-6 last:border-b-0 last:pb-0">
          <div className="flex items-start">
            <Avatar className="h-10 w-10 mr-4">
              {rating.reviewer_avatar ? (
                <AvatarImage src={rating.reviewer_avatar} alt={rating.reviewer_name} />
              ) : (
                <AvatarFallback>{rating.reviewer_name.charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{rating.reviewer_name}</h4>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(rating.created_at), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{rating.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
