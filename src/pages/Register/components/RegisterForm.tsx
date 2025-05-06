
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import { PhoneField } from './PhoneField';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { EmailConfirmationDialog } from '@/hooks/auth/EmailConfirmationDialog';

export const RegisterForm = () => {
  const { register: signUp, signInWithGoogle, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      person_type: 'fisica',
      role: 'contractor',
    },
  });

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
        description: "Por favor, verifique os critérios de segurança.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Log form data for debugging
      console.log('Submitting registration with data:', values);
      
      // Garantir que is_onboarding_complete seja enviado como booleano
      const completeFormData: RegisterFormData = {
        ...values,
        is_onboarding_complete: false, // Set to false initially, will be updated in onboarding flow
      };
      
      await signUp(completeFormData);
      
      console.log('Registration submitted successfully');
      // Mostrar diálogo de confirmação
      setConfirmationEmail(values.email);
      setShowEmailConfirmation(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = "Ocorreu um erro ao processar seu cadastro";
      
      // Handle specific Supabase errors
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado. Por favor, tente fazer login.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("Error sending confirmation email")) {
          errorMessage = "Erro ao enviar email de confirmação. Verifique se o email está correto.";
        } else {
          errorMessage = error.message;
        }
      }
      
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
          <RoleSelector form={form} selectedRole={selectedRole} />
          
          <BasicInfoFields form={form} />
          
          <div className="space-y-2">
            <PasswordRequirements passwordRequirements={passwordRequirements} />
            <PasswordStrengthMeter password={watchPassword} />
          </div>

          {/* Phone field below password requirements */}
          <PhoneField form={form} />
          
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
