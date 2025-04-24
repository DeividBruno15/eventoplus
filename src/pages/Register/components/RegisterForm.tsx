
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { RoleSelector } from './RoleSelector';
import { PersonTypeSelector } from './PersonTypeSelector';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from '@/components/address/AddressFields';
import { DocumentFields } from './DocumentFields';
import { SocialLogin } from './SocialLogin';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/useAuth';

export const RegisterForm = () => {
  const { register, signInWithGoogle, loading } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      person_type: 'fisica',
      role: 'contractor',
    },
  });

  const onSubmit = (values: RegisterFormData) => {
    register(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RoleSelector form={form} />
        <BasicInfoFields form={form} />
        <PersonTypeSelector form={form} />
        <DocumentFields form={form} />
        <AddressFields form={form} />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>

        <SocialLogin onGoogleClick={signInWithGoogle} />

        <div className="text-center mt-4 text-sm">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Faça login
          </Link>
        </div>
      </form>
    </Form>
  );
};
