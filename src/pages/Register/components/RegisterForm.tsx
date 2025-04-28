
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from '@/components/address/AddressFields';
import { DocumentFields } from './DocumentFields';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ServiceCategoriesField } from './ServiceCategoriesField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { PasswordRequirements } from './PasswordRequirements';
import { RegistrationButtons } from './RegistrationButtons';
import { PersonTypeSelector } from './PersonTypeSelector';
import { RoleSelector } from './RoleSelector';
import { PhoneField } from './PhoneField';

export const RegisterForm = () => {
  const { register: signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      person_type: 'fisica',
      role: 'contractor',
    },
  });

  const selectedRole = form.watch('role');
  const watchPassword = form.watch('password', '');

  useEffect(() => {
    setPassword(watchPassword);
    
    // Check password requirements
    setPasswordRequirements({
      length: watchPassword.length >= 8,
      uppercase: /[A-Z]/.test(watchPassword),
      lowercase: /[a-z]/.test(watchPassword),
      number: /[0-9]/.test(watchPassword),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watchPassword),
    });
  }, [watchPassword]);

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req === true);

  const onSubmit = async (values: RegisterFormData) => {
    if (!allRequirementsMet) {
      toast({
        title: "Requisitos não atendidos",
        description: "Por favor, verifique os critérios de segurança.",
        variant: "destructive"
      });
      return;
    }
    
    // Complete form submission with is_onboarding_complete set to true
    const completeFormData = {
      ...values,
      is_onboarding_complete: true,
    };
    
    try {
      await signUp(completeFormData as RegisterFormData);
      toast({
        title: "Cadastro realizado",
        description: "Seu cadastro foi realizado com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao processar seu cadastro",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RoleSelector form={form} selectedRole={selectedRole} />
        
        <BasicInfoFields form={form} />
        
        <div className="space-y-2">
          <PasswordRequirements passwordRequirements={passwordRequirements} />
          <PasswordStrengthMeter password={password} />
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
          isSubmitting={loading} 
          onGoogleLogin={signInWithGoogle} 
        />
      </form>
    </Form>
  );
};
