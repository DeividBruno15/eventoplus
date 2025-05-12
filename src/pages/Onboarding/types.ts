
import { z } from 'zod';

// Define the steps in the onboarding process
export enum OnboardingStep {
  PLATFORM_USAGE = 1,
  PROVIDER_TYPE = 2,
  CONFIRMATION = 3,
  PHONE_TERMS = 4
}

// Schema for onboarding data
export const onboardingFunctionsSchema = z.object({
  // User function preferences
  is_contratante: z.boolean().default(false),
  is_prestador: z.boolean().default(false),
  candidata_eventos: z.boolean().default(false),
  divulga_servicos: z.boolean().default(false),
  divulga_eventos: z.boolean().default(false),
  divulga_locais: z.boolean().default(false),
  
  // Contact information
  phone_number: z.string().optional(),
  accept_whatsapp: z.boolean().default(true),
  accept_terms: z.boolean().default(false)
});

// Type for the onboarding data
export type OnboardingFunctionsData = z.infer<typeof onboardingFunctionsSchema>;

// Type for the complete registration form
export type OnboardingFormData = OnboardingFunctionsData;
