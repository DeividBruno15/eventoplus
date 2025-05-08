
import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(1, "Nome do evento é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  event_date: z.string().min(1, "Data do evento é obrigatória"),
  event_time: z.string().min(1, "Horário do evento é obrigatório"),
  street: z.string().min(1, "Nome da rua é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  zipcode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  service_requests: z.array(
    z.object({
      category: z.string(),
      count: z.number().positive(),
      price: z.number().nonnegative(),
    })
  ),
  company_id: z.string().optional(),
  venue_id: z.string().optional(),
  image: z.instanceof(File).nullable().optional(),
});
