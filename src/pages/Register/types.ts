
import { z } from 'zod';

export const registerFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  first_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  last_name: z.string(),
  person_type: z.enum(['fisica', 'juridica']),
  document_number: z.string().min(11, 'CPF/CNPJ inválido'),
  role: z.enum(['contractor', 'provider']),
  address: z.string(),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
