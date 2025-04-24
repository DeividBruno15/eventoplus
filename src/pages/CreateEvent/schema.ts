
import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório e deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Por favor, forneça uma descrição detalhada do evento (min. 10 caracteres)'),
  event_date: z.string().min(1, 'A data do evento é obrigatória'),
  event_time: z.string().min(1, 'O horário do evento é obrigatório'),
  location: z.string().min(5, 'O local do evento é obrigatório (min. 5 caracteres)'),
  service_type: z.string().min(3, 'O tipo de serviço é obrigatório (min. 3 caracteres)'),
  max_attendees: z.union([
    z.string().optional().transform(val => val === '' ? null : parseInt(val, 10)),
    z.number().optional(),
    z.null()
  ])
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
