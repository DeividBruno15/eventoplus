
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export type RegisterData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  person_type: 'fisica' | 'juridica';
  document_number: string;
  role: 'contractor' | 'provider';
  address: string;
  city: string;
  state: string;
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            person_type: data.person_type,
            document_number: data.document_number,
            role: data.role,
            address: data.address,
            city: data.city,
            state: data.state,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro ao entrar com Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    register,
    signInWithGoogle,
    loading,
  };
};
