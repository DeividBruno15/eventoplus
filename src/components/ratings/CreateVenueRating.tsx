
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').max(100, 'O título deve ter no máximo 100 caracteres'),
  comment: z.string().min(10, 'O comentário deve ter pelo menos 10 caracteres').max(500, 'O comentário deve ter no máximo 500 caracteres'),
  overall_rating: z.number().min(1).max(5),
  location_rating: z.number().min(1).max(5).optional(),
  value_rating: z.number().min(1).max(5).optional(),
  cleanliness_rating: z.number().min(1).max(5).optional(),
  service_rating: z.number().min(1).max(5).optional(),
  amenities_rating: z.number().min(1).max(5).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateVenueRatingProps {
  venueId: string;
  onSuccess: () => void;
}

export const CreateVenueRating = ({ venueId, onSuccess }: CreateVenueRatingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      comment: '',
      overall_rating: 0,
      location_rating: undefined,
      value_rating: undefined,
      cleanliness_rating: undefined,
      service_rating: undefined,
      amenities_rating: undefined,
    },
  });

  const handleStarClick = (field: string, rating: number) => {
    form.setValue(field as any, rating, { shouldValidate: true });
  };

  const StarRating = ({ name, value }: { name: string, value: number | undefined }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(name, star)}
            className="p-1"
          >
            <Star
              className={`h-6 w-6 ${
                (value || 0) >= star
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error('Você precisa estar logado para avaliar');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('venue_ratings')
        .insert({
          venue_id: venueId,
          user_id: user.id,
          title: data.title,
          comment: data.comment,
          overall_rating: data.overall_rating,
          location_rating: data.location_rating || null,
          value_rating: data.value_rating || null,
          cleanliness_rating: data.cleanliness_rating || null,
          service_rating: data.service_rating || null,
          amenities_rating: data.amenities_rating || null,
        });

      if (error) throw error;
      
      toast.success('Avaliação enviada com sucesso!');
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast.error(error.message || 'Erro ao enviar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="overall_rating"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Avaliação Geral*</FormLabel>
              <FormControl>
                <StarRating name="overall_rating" value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location_rating"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <StarRating name="location_rating" value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="value_rating"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Custo-benefício</FormLabel>
                <FormControl>
                  <StarRating name="value_rating" value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cleanliness_rating"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Limpeza</FormLabel>
                <FormControl>
                  <StarRating name="cleanliness_rating" value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="service_rating"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Atendimento</FormLabel>
                <FormControl>
                  <StarRating name="service_rating" value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da avaliação*</FormLabel>
              <FormControl>
                <Input placeholder="Resumo da sua experiência" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu comentário*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte sobre sua experiência com este local..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateVenueRating;
