
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from '@/components/address/AddressFields';
import { DocumentFields } from './DocumentFields';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/auth';
import { toast } from '@/hooks/use-toast';
import { ServiceCategoriesField } from './ServiceCategoriesField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { PasswordRequirements } from './PasswordRequirements';
import { RegistrationButtons } from './RegistrationButtons';
import { PersonTypeSelector } from './PersonTypeSelector';
import { RoleSelector } from './RoleSelector';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { EmailConfirmationDialog } from '@/hooks/auth/EmailConfirmationDialog';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const RegisterForm = () => {
  const { register: signUp, signInWithGoogle, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obter dados do onboarding, se disponíveis
  const onboardingData = location.state?.onboardingData || {};

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      person_type: 'fisica',
      role: onboardingData.is_prestador ? 'provider' : 'contractor',
      // Inclua quaisquer outros valores do onboarding que sejam relevantes
      is_onboarding_complete: false,
      // ... outros campos do onboarding se necessário
    },
    mode: 'onBlur',
  });

  // Atualizar o formulário com os dados de onboarding quando disponíveis
  useEffect(() => {
    if (onboardingData && Object.keys(onboardingData).length > 0) {
      // Preencher os campos do formulário com os valores do onboarding
      if (onboardingData.is_prestador) {
        form.setValue('role', 'provider');
      } else if (onboardingData.is_contratante) {
        form.setValue('role', 'contractor');
      }
      
      // Você pode adicionar mais atualizações de campos aqui conforme necessário
    }
  }, [onboardingData, form]);

  const selectedRole = form.watch('role');
  const watchPassword = form.watch('password', '');
  
  // Use our custom password validation hook
  const { 
    passwordRequirements, 
    allRequirementsMet,
    passwordStrength, 
    strengthLabel 
  } = usePasswordValidation(watchPassword);

  const onSubmit = async (values: RegisterFormData) => {
    if (!allRequirementsMet) {
      toast({
        title: "Requisitos não atendidos",
        description: "Por favor, verifique os critérios de segurança da senha.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setFormError(null);
      
      // Log form data for debugging
      console.log('Submitting registration with data:', values);
      
      // Mesclar os dados do onboarding com os dados do formulário
      const completeFormData: RegisterFormData = {
        ...values,
        // Incorporar os dados relevantes do onboarding, se disponíveis
        is_contratante: onboardingData.is_contratante || false,
        is_prestador: onboardingData.is_prestador || false,
        candidata_eventos: onboardingData.candidata_eventos || false,
        divulga_servicos: onboardingData.divulga_servicos || false,
        divulga_eventos: onboardingData.divulga_eventos || false,
        divulga_locais: onboardingData.divulga_locais || false,
        is_onboarding_complete: false, // Será atualizado na etapa final do onboarding
      };
      
      await signUp(completeFormData);
      
      console.log('Registration submitted successfully - redirecting to onboarding');
      // Redirecionar para a etapa final do onboarding (etapa 4)
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = "Ocorreu um erro ao processar seu cadastro";
      
      // Handle specific errors
      if (error.message) {
        if (error.message.includes("Este e-mail já está cadastrado")) {
          errorMessage = "Este e-mail já está cadastrado";
          form.setError('email', { type: 'manual', message: errorMessage });
        } else if (error.message.includes("Este CPF já está cadastrado")) {
          errorMessage = "Este CPF já está cadastrado";
          form.setError('document_number', { type: 'manual', message: errorMessage });
        } else if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado. Por favor, tente fazer login.";
          form.setError('email', { type: 'manual', message: errorMessage });
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("Error sending confirmation email")) {
          errorMessage = "Erro ao enviar email de confirmação. Verifique se o email está correto.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setFormError(errorMessage);
      toast({
        title: "Erro ao cadastrar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeConfirmationDialog = () => {
    setShowEmailConfirmation(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <RoleSelector form={form} selectedRole={selectedRole} />
          
          <BasicInfoFields form={form} />
          
          <div className="space-y-2">
            <PasswordRequirements 
              requirements={passwordRequirements} 
              passwordStrength={passwordStrength} 
              strengthLabel={strengthLabel}
            />
            <PasswordStrengthMeter password={watchPassword} />
          </div>
          
          <PersonTypeSelector form={form} />
          <DocumentFields form={form} />
          <AddressFields form={form} />
          
          {selectedRole === 'provider' && (
            <ServiceCategoriesField form={form} />
          )}

          <RegistrationButtons 
            isSubmitting={submitting || loading} 
            onGoogleLogin={signInWithGoogle} 
          />
        </form>
      </Form>
      
      <EmailConfirmationDialog
        open={showEmailConfirmation}
        onClose={closeConfirmationDialog}
        email={confirmationEmail}
      />
    </>
  );
};
