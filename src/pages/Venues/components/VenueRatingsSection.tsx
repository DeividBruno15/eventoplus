
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { VenueRating } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface VenueRatingsSectionProps {
  venueId: string;
  ownerId: string;
  userIsAuthenticated: boolean;
}

const VenueRatingsSection: React.FC<VenueRatingsSectionProps> = ({
  venueId,
  ownerId,
  userIsAuthenticated
}) => {
  const [ratings, setRatings] = useState<VenueRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('venue_ratings')
        .select(`
          *,
          user:user_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format data to match our VenueRating type
      const formattedRatings: VenueRating[] = data.map(item => ({
        id: item.id,
        venue_id: item.venue_id,
        user_id: item.user_id,
        overall_rating: item.overall_rating,
        location_rating: item.location_rating,
        value_rating: item.value_rating,
        service_rating: item.service_rating,
        cleanliness_rating: item.cleanliness_rating,
        amenities_rating: item.amenities_rating,
        comment: item.comment,
        created_at: item.created_at,
        user_name: `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim(),
        user_avatar: item.user?.avatar_url,
        owner_response: item.owner_response
      }));

      setRatings(formattedRatings);

      // Check if current user has already rated
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const hasRated = data.some(r => r.user_id === userData.user?.id);
        setUserHasRated(hasRated);
      }
    } catch (error) {
      console.error('Error fetching venue ratings:', error);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (venueId) {
      fetchRatings();
    }
  }, [venueId]);

  const handleRatingSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Por favor, adicione um comentário');
      return;
    }

    try {
      setSubmitting(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('É necessário estar logado para avaliar');
      }

      const { error } = await supabase
        .from('venue_ratings')
        .insert({
          venue_id: venueId,
          user_id: userData.user.id,
          overall_rating: rating,
          comment,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Avaliação enviada com sucesso!');
      setIsDialogOpen(false);
      setComment('');
      setRating(5);
      fetchRatings();
      
      // Send notification to the venue owner
      await supabase.from('notifications').insert({
        user_id: ownerId,
        title: 'Nova avaliação recebida',
        content: `Seu espaço recebeu uma nova avaliação de ${userData.user?.user_metadata?.first_name || 'um usuário'}`,
        type: 'rating',
        link: `/venues/details/${venueId}`
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Avaliações ({ratings.length})</h2>
        {userIsAuthenticated && !userHasRated && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            size="sm"
          >
            Avaliar este espaço
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </Card>
      ) : ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <Card key={rating.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {rating.user_avatar ? (
                      <img
                        src={rating.user_avatar}
                        alt={rating.user_name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      rating.user_name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{rating.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(rating.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {renderStars(rating.overall_rating)}
                  <span className="text-sm font-medium">
                    {rating.overall_rating.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <p className="mt-4">{rating.comment}</p>
              
              {rating.owner_response && (
                <div className="mt-4 bg-muted/30 p-3 rounded-md">
                  <p className="text-sm font-medium">Resposta do proprietário:</p>
                  <p className="text-sm mt-1">{rating.owner_response.response}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(rating.owner_response.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Este espaço ainda não possui avaliações.</p>
        </Card>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Avaliar Espaço</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Avaliação</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="h-10 w-10 rounded-full flex items-center justify-center focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comentário</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sua experiência com este espaço..."
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRatingSubmit}
              disabled={submitting || !comment.trim()}
            >
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenueRatingsSection;
