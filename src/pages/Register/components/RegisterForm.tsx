
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { BasicInfoFields } from './BasicInfoFields';
import { AddressFields } from '@/components/address/AddressFields';
import { DocumentFields } from './DocumentFields';
import { Card, CardContent } from '@/components/ui/card';
import { registerFormSchema, RegisterFormData } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { ServiceCategoriesField } from './ServiceCategoriesField';
import { useState, useEffect } from 'react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

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
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Selecione seu perfil</p>
          <Tabs 
            defaultValue="contractor"
            onValueChange={(value) => form.setValue('role', value as 'contractor' | 'provider')}
            value={selectedRole}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="contractor">Contratante</TabsTrigger>
              <TabsTrigger value="provider">Prestador</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <BasicInfoFields form={form} />
        
        <div className="space-y-2">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700 font-medium">
              Requisitos de segurança
            </AlertDescription>
            <ul className="mt-2 text-sm space-y-1">
              <li className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                <span className={`mr-2 text-lg ${passwordRequirements.length ? '✓' : '•'}`}></span>
                Pelo menos 8 caracteres
              </li>
              <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                <span className={`mr-2 text-lg ${passwordRequirements.uppercase ? '✓' : '•'}`}></span>
                Uma letra maiúscula
              </li>
              <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                <span className={`mr-2 text-lg ${passwordRequirements.lowercase ? '✓' : '•'}`}></span>
                Uma letra minúscula
              </li>
              <li className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-600'}`}>
                <span className={`mr-2 text-lg ${passwordRequirements.number ? '✓' : '•'}`}></span>
                Um número
              </li>
              <li className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-600'}`}>
                <span className={`mr-2 text-lg ${passwordRequirements.special ? '✓' : '•'}`}></span>
                Um caractere especial (!@#$%^&*()_+...)
              </li>
            </ul>
          </Alert>
          
          <PasswordStrengthMeter password={password} />
        </div>
        
        <PersonTypeSelector form={form} />
        <DocumentFields form={form} />
        <AddressFields form={form} />
        
        {selectedRole === 'provider' && (
          <ServiceCategoriesField form={form} />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !allRequirementsMet}
        >
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </Button>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <GoogleLoginButton 
              loading={loading} 
              onLogin={signInWithGoogle} 
              text="Cadastrar com Google"
            />
            
            <div className="text-center text-sm mt-4">
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
