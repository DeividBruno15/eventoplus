
import { z } from 'zod';

export const registerFormSchema = z.object({
  role: z.enum(['contractor', 'provider', 'advertiser']),
  first_name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  last_name: z.string().min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  person_type: z.enum(['fisica', 'juridica']),
  document_number: z.string().min(11, { message: "Documento inválido" }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  city: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }),
  state: z.string().min(2, { message: "Estado deve ter pelo menos 2 caracteres" }),
  zipcode: z.string().min(8, { message: "CEP inválido" }).optional(),
  service_categories: z.array(z.string()).optional(),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos de serviço',
  }),
  // Campos do onboarding
  is_contratante: z.boolean().default(false),
  is_prestador: z.boolean().default(false),
  candidata_eventos: z.boolean().default(false),
  divulga_servicos: z.boolean().default(false),
  divulga_eventos: z.boolean().default(false),
  divulga_locais: z.boolean().default(false),
  is_onboarding_complete: z.boolean().default(false),
  phone_number: z.string().optional(),
  accept_whatsapp: z.boolean().default(true),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
