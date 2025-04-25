
import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(3, 'Nome do evento deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  event_date: z.string().min(1, 'Data do evento é obrigatória'),
  event_time: z.string().min(1, 'Horário do evento é obrigatório'),
  location: z.string().min(3, 'Localização deve ter pelo menos 3 caracteres'),
  service_type: z.string().min(1, 'Tipo de serviço é obrigatório'),
  max_attendees: z.number().nullable(),
  image: z.any().nullable() // accepts File object or null
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
