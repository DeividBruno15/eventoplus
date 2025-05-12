
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { RegisterFormData } from '@/pages/Register/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  register: (data: RegisterFormData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
  updateOnboardingStatus: (isComplete: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Estabelecer o ouvinte de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Verificar se há uma sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Registrar um novo usuário
  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Registrar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
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
            is_onboarding_complete: false,
          }
        }
      });

      if (authError) throw authError;

      // Mostrar toast de sucesso
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar seu cadastro.",
      });

    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fazer login com email e senha
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verificar se o usuário precisa completar o onboarding
      if (data.user && !data.user.user_metadata?.is_onboarding_complete) {
        // O onboarding será tratado nas rotas
        toast({
          title: "Login realizado com sucesso",
          description: "Vamos finalizar seu cadastro.",
        });
      } else {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fazer logout
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro no logout:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login com Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Recuperação de senha
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error('Erro na recuperação de senha:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar senha
  const updatePassword = async (password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro na atualização de senha:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateProfile = async (profile: any) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: profile,
      });

      if (error) throw error;

      // Atualizar o usuário local com os novos dados
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          user_metadata: {
            ...prevUser.user_metadata,
            ...profile,
          },
        };
      });

      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro na atualização do perfil:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o status de onboarding
  const updateOnboardingStatus = async (isComplete: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { is_onboarding_complete: isComplete },
      });

      if (error) throw error;

      // Atualizar o usuário local
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          user_metadata: {
            ...prevUser.user_metadata,
            is_onboarding_complete: isComplete,
          },
        };
      });

    } catch (error: any) {
      console.error('Erro ao atualizar status de onboarding:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    register,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    updateProfile,
    updateOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
