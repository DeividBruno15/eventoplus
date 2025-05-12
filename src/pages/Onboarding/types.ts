
import { z } from 'zod';

export enum OnboardingStep {
  PLATFORM_USAGE = 1,
  PROVIDER_TYPE = 2,
  CONFIRMATION = 3,
  PHONE_TERMS = 4
}

// Esquema para validação do formulário de onboarding
export const onboardingFunctionsSchema = z.object({
  is_contratante: z.boolean().default(false),
  is_prestador: z.boolean().default(false),
  candidata_eventos: z.boolean().default(false),
  divulga_servicos: z.boolean().default(false),
  divulga_eventos: z.boolean().default(false),
  divulga_locais: z.boolean().default(false),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos de serviço',
  }),
  phone_number: z.string().min(10, 'Telefone inválido'),
  accept_whatsapp: z.boolean().default(true),
});

export type OnboardingFunctionsData = z.infer<typeof onboardingFunctionsSchema>;
