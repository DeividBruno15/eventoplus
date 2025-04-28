
import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "O nome do evento é obrigatório e deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição é obrigatória e deve ter pelo menos 10 caracteres"),
  event_date: z.string().min(1, "A data do evento é obrigatória"),
  event_time: z.string().min(1, "A hora do evento é obrigatória"),
  location: z.string().min(5, "O local do evento é obrigatório"),
  max_attendees: z.number().nullable(),
  service_requests: z.array(
    z.object({
      category: z.string(),
      count: z.number().min(1, "A quantidade deve ser pelo menos 1")
    })
  ).optional(),
  image: z.any().optional()
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
