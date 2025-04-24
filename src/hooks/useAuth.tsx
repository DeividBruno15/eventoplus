
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RegisterFormData } from '@/pages/Register/types';
import { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });

        // Navigation should happen after state update to avoid race conditions
        setTimeout(() => {
          navigate('/dashboard');
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta.",
        });
        navigate('/');
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        // Navigate to dashboard if user is already logged in
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const register = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      
      // Update user fields to include all needed data from the beginning
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
            phone_number: data.phone_number,
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            is_onboarding_complete: true, // Mark onboarding as complete during registration
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar seu cadastro.",
      });
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || 'Ocorreu um erro durante o cadastro',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Let the onAuthStateChange handler handle the navigation
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || 'Credenciais inválidas',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log("Iniciando login com Google...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      console.log("Redirecionando para Google:", data);
      
    } catch (error: any) {
      console.error('Erro ao iniciar login com Google:', error);
      toast({
        title: "Erro ao entrar com Google",
        description: error.message || 'Não foi possível conectar ao Google',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("Iniciando logout...");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || 'Ocorreu um erro ao tentar sair',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    signInWithGoogle,
    logout,
    loading,
    session,
    user
  };
};
