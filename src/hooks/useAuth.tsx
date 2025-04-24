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
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (event === 'SIGNED_IN') {
        checkOnboardingStatus(currentSession?.user?.id);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta.",
        });
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        checkOnboardingStatus(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const checkOnboardingStatus = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_onboarding_complete')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setIsOnboardingComplete(Boolean(data?.is_onboarding_complete));
      
      if (data?.is_onboarding_complete) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      setIsOnboardingComplete(false);
      navigate('/onboarding');
    }
  };

  const register = async (data: RegisterFormData) => {
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
            phone_number: data.phone_number,
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar seu cadastro.",
      });
      
      navigate('/onboarding');
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

  const updateOnboardingStatus = async (complete: boolean = true) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_onboarding_complete: complete })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsOnboardingComplete(complete);
      
      toast({
        title: "Onboarding concluído!",
        description: "Agora você pode usar todas as funcionalidades da plataforma.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao atualizar status de onboarding:', error);
      toast({
        title: "Erro ao finalizar onboarding",
        description: error.message || 'Ocorreu um erro ao finalizar o processo de onboarding',
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
    updateOnboardingStatus,
    loading,
    session,
    user,
    isOnboardingComplete
  };
};
