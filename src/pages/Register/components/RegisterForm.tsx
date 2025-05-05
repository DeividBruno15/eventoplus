
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from '@/components/address/AddressFields';
import { DocumentFields } from './DocumentFields';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { ServiceCategoriesField } from './ServiceCategoriesField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { PasswordRequirements } from './PasswordRequirements';
import { RegistrationButtons } from './RegistrationButtons';
import { PersonTypeSelector } from './PersonTypeSelector';
import { RoleSelector } from './RoleSelector';
import { PhoneField } from './PhoneField';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

export const RegisterForm = () => {
  const { register: signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

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
      
      // Garantir que is_onboarding_complete seja enviado como booleano
      const completeFormData: RegisterFormData = {
        ...values,
        is_onboarding_complete: true,
      };
      
      console.log('Submitting registration with data:', completeFormData);
      await signUp(completeFormData);
      // A tela de confirmação é exibida dentro do hook useAuth
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao processar seu cadastro",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RoleSelector form={form} selectedRole={selectedRole} />
        
        <BasicInfoFields form={form} />
        
        <div className="space-y-2">
          <PasswordRequirements passwordRequirements={passwordRequirements} />
          <PasswordStrengthMeter password={watchPassword} />
        </div>

        {/* Phone field moved below password requirements */}
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
  );
};
