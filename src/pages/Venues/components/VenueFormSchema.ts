
import { z } from "zod";

export const venueFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição muito curta").max(1000, "Descrição muito longa"),
  venue_type: z.string().min(1, "Selecione o tipo de espaço"),
  max_capacity: z.string().min(1, "Informe a capacidade máxima"),
  price_per_day: z.string().min(1, "Informe o preço por dia"),
  is_rentable: z.boolean().default(true),
  amenities: z.array(z.string()).default([]),
  rules: z.string().max(500, "Regras muito longas").optional(),
  external_link: z.string().url("URL inválida").or(z.string().length(0)).optional(),
  venue_id: z.string().min(1, "Selecione um local cadastrado"),
  social_instagram: z.string().url("URL inválida").or(z.string().length(0)).optional(),
  social_facebook: z.string().url("URL inválida").or(z.string().length(0)).optional(),
  social_twitter: z.string().url("URL inválida").or(z.string().length(0)).optional(),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;
