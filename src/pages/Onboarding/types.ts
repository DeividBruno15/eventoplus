
import { z } from 'zod';

export const onboardingSchema = z.object({
  phone_number: z.string().min(10, 'Telefone inválido'),
  accept_whatsapp: z.boolean().default(true),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos de serviço',
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
