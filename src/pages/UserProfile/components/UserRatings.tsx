
import { useUserRatings } from '@/hooks/useUserRatings';
import { RatingsList } from '@/components/ratings/RatingsList';
import { RatingSummary } from '@/components/ratings/RatingSummary';
import { CreateRating } from '@/components/ratings/CreateRating';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

interface UserRatingsProps {
  userId: string;
}

export const UserRatings = ({ userId }: UserRatingsProps) => {
  const { ratings, loading, averageRating, totalRatings } = useUserRatings({ userId });
  const { user } = useAuth();
  
  // Verificar se o usuário atual pode avaliar (não é o próprio usuário)
  const canRate = user && user.id !== userId;

  return (
    <div className="space-y-6">
      {/* Resumo das avaliações */}
      {totalRatings > 0 && (
        <RatingSummary 
          ratings={ratings}
          averageRating={averageRating}
          totalRatings={totalRatings}
        />
      )}
      
      {/* Formulário para criar avaliações */}
      {canRate && (
        <>
          <CreateRating userId={userId} />
          <Separator className="my-6" />
        </>
      )}
      
      {/* Lista de avaliações */}
      <RatingsList 
        ratings={ratings}
        isLoading={loading}
        emptyMessage="Este usuário ainda não recebeu avaliações"
      />
    </div>
  );
};
