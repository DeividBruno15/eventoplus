
import { z } from "zod";

export const venueFormSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  venue_type: z.string().min(1, "Selecione o tipo de local"),
  max_capacity: z.coerce.number().min(1, "A capacidade deve ser um número maior que zero"),
  price_per_day: z.coerce.number().min(1, "O preço deve ser um número maior que zero"),
  venue_id: z.string().min(1, "Selecione um local"),
  is_rentable: z.boolean().default(true),
  amenities: z.array(z.string()).default([]),
  rules: z.string().optional(),
  external_link: z.string().url("URL inválida").optional().or(z.literal("")),
  social_instagram: z.string().optional().or(z.literal("")),
  social_facebook: z.string().optional().or(z.literal("")),
  social_twitter: z.string().optional().or(z.literal(""))
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;
