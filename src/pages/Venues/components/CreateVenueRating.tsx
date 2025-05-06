
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from './StarRating';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { VenueRating } from '../types';

interface CreateVenueRatingProps {
  venueId: string;
  onSuccess: (rating: VenueRating) => void;
  onCancel: () => void;
}

// Schema para validação do formulário
const ratingSchema = z.object({
  overall_rating: z.number().min(1, "Avaliação geral é obrigatória").max(5),
  location_rating: z.number().min(1, "Avaliação de localização é obrigatória").max(5),
  value_rating: z.number().min(1, "Avaliação de custo-benefício é obrigatória").max(5),
  service_rating: z.number().min(1, "Avaliação de atendimento é obrigatória").max(5),
  cleanliness_rating: z.number().min(1, "Avaliação de limpeza é obrigatória").max(5),
  amenities_rating: z.number().min(1, "Avaliação de comodidades é obrigatória").max(5),
  comment: z.string().min(3, "O comentário deve ter pelo menos 3 caracteres").max(500, "O comentário deve ter no máximo 500 caracteres"),
});

type RatingForm = z.infer<typeof ratingSchema>;

const CreateVenueRating: React.FC<CreateVenueRatingProps> = ({ 
  venueId, 
  onSuccess, 
  onCancel 
}) => {
  const { user } = useAuth();
  const form = useForm<RatingForm>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      overall_rating: 0,
      location_rating: 0,
      value_rating: 0,
      service_rating: 0,
      cleanliness_rating: 0,
      amenities_rating: 0,
      comment: "",
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  const onSubmit = async (data: RatingForm) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma avaliação");
      return;
    }
    
    try {
      const { data: ratingData, error } = await supabase
        .from('venue_ratings')
        .insert([
          {
            venue_id: venueId,
            user_id: user.id,
            overall_rating: data.overall_rating,
            location_rating: data.location_rating,
            value_rating: data.value_rating,
            service_rating: data.service_rating,
            cleanliness_rating: data.cleanliness_rating,
            amenities_rating: data.amenities_rating,
            comment: data.comment,
          }
        ])
        .select('*, user_profiles:user_id(first_name, last_name, avatar_url)')
        .single();
        
      if (error) throw error;
      
      // Formatar dados para o componente pai
      const newRating: VenueRating = {
        id: ratingData.id,
        venue_id: ratingData.venue_id,
        user_id: ratingData.user_id,
        overall_rating: ratingData.overall_rating,
        location_rating: ratingData.location_rating,
        value_rating: ratingData.value_rating,
        service_rating: ratingData.service_rating,
        cleanliness_rating: ratingData.cleanliness_rating,
        amenities_rating: ratingData.amenities_rating,
        comment: ratingData.comment,
        created_at: ratingData.created_at,
        user_name: `${ratingData.user_profiles.first_name} ${ratingData.user_profiles.last_name}`,
        user_avatar: ratingData.user_profiles.avatar_url,
      };
      
      toast.success("Avaliação enviada com sucesso!");
      onSuccess(newRating);
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error(error.message || "Erro ao enviar avaliação");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avalie este espaço</CardTitle>
        <CardDescription>
          Compartilhe sua experiência para ajudar outros usuários
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Avaliação geral */}
            <FormField
              control={form.control}
              name="overall_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avaliação geral</FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Grid para as outras categorias de avaliação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Localização */}
              <FormField
                control={form.control}
                name="location_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        size="sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Custo-benefício */}
              <FormField
                control={form.control}
                name="value_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo-benefício</FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        size="sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Atendimento */}
              <FormField
                control={form.control}
                name="service_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atendimento</FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        size="sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Limpeza */}
              <FormField
                control={form.control}
                name="cleanliness_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limpeza</FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        size="sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Comodidades */}
              <FormField
                control={form.control}
                name="amenities_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comodidades</FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        size="sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Comentário */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentário</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte sua experiência neste espaço..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/500 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateVenueRating;
