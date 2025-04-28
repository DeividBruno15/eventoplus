
import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "O nome do evento é obrigatório e deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição é obrigatória e deve ter pelo menos 10 caracteres"),
  event_date: z.string().min(1, "A data do evento é obrigatória"),
  event_time: z.string().min(1, "A hora do evento é obrigatória"),
  zipcode: z.string().min(8, "O CEP é obrigatório").max(9, "CEP inválido"),
  street: z.string().min(2, "A rua é obrigatória"),
  number: z.string().min(1, "O número é obrigatório"),
  neighborhood: z.string().min(2, "O bairro é obrigatório"),
  city: z.string().min(2, "A cidade é obrigatória"),
  state: z.string().min(2, "O estado é obrigatório"),
  location: z.string().min(5, "O local do evento é obrigatório"),
  service_requests: z.array(
    z.object({
      category: z.string(),
      count: z.number().min(1, "A quantidade deve ser pelo menos 1"),
      filled: z.number().optional().default(0)
    })
  ).optional(),
  image: z.any().optional()
});

// Re-export the type from the centralized location
export type { CreateEventFormData } from "@/types/events";
