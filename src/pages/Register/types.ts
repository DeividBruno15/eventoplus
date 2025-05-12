
import { z } from 'zod';

export const registerFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
  first_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  last_name: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  person_type: z.enum(['fisica', 'juridica']),
  document_number: z.string().min(11, 'CPF/CNPJ inválido'),
  role: z.enum(['contractor', 'provider', 'advertiser']),
  zipcode: z.string().min(8, 'CEP inválido'),
  street: z.string().min(2, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string(),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  service_categories: z.array(z.string()).optional(),
  is_onboarding_complete: z.boolean().optional(),
  // Add onboarding-related fields
  is_contratante: z.boolean().optional(),
  is_prestador: z.boolean().optional(),
  candidata_eventos: z.boolean().optional(),
  divulga_servicos: z.boolean().optional(),
  divulga_eventos: z.boolean().optional(),
  divulga_locais: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
