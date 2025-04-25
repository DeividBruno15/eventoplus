
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
import { Card, CardContent } from '@/components/ui/card';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { RoleCard } from './RoleCard';
import { ServiceCategoriesField } from './ServiceCategoriesField';

export const RegisterForm = () => {
  const { register: signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      person_type: 'fisica',
      role: 'contractor',
    },
  });

  const selectedRole = form.watch('role');

  const onSubmit = async (values: RegisterFormData) => {
    // Complete form submission with is_onboarding_complete set to true
    const completeFormData = {
      ...values,
      is_onboarding_complete: true,
    };
    await signUp(completeFormData as RegisterFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <p className="label mb-2">Selecione seu perfil</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RoleCard 
              role="contractor" 
              selected={selectedRole === 'contractor'}
              onClick={() => form.setValue('role', 'contractor')}
            />
            <RoleCard 
              role="provider" 
              selected={selectedRole === 'provider'}
              onClick={() => form.setValue('role', 'provider')}
            />
          </div>
        </div>
        
        <BasicInfoFields form={form} />
        <PersonTypeSelector form={form} />
        <DocumentFields form={form} />
        <AddressFields form={form} />
        
        {selectedRole === 'provider' && (
          <ServiceCategoriesField form={form} />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </Button>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
              onClick={() => signInWithGoogle()}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Continuar com Google
            </Button>
            
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary/80"
              >
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
