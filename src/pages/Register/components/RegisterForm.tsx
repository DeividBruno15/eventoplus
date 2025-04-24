
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { RoleSelector } from './RoleSelector';
import { PersonTypeSelector } from './PersonTypeSelector';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from '@/components/address/AddressFields';
import { DocumentFields } from './DocumentFields';
import { SocialLogin } from './SocialLogin';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const RegisterForm = () => {
  const { register, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      person_type: 'fisica',
      role: 'contractor',
      ...formData,
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    if (step === 1) {
      // Save step 1 data and move to step 2
      setFormData({
        ...formData,
        ...values,
      });
      setStep(2);
    } else {
      // Final submission
      const completeFormData = {
        ...formData,
        ...values,
        is_onboarding_complete: false, // Será atualizado após a segunda etapa do onboarding
      };
      await register(completeFormData as RegisterFormData);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div className={`rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
            {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <div className={`h-1 w-12 ${step > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
            "2"
          </div>
        </div>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderStepIndicator()}

        {step === 1 && (
          <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              <p className="text-sm text-muted-foreground">Preencha seus dados pessoais</p>
            </div>
            <RoleSelector form={form} />
            <BasicInfoFields form={form} />
            <PersonTypeSelector form={form} />
            <DocumentFields form={form} />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              Continuar
            </Button>

            <SocialLogin onGoogleClick={signInWithGoogle} />
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Endereço</h3>
              <p className="text-sm text-muted-foreground">Preencha seu endereço</p>
            </div>
            <AddressFields form={form} />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={goBack}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            </div>
          </>
        )}

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
