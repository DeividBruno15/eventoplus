import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { EmailConfirmationDialog } from './EmailConfirmationDialog';
import { RegisterFormData } from '@/pages/Register/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  // For local testing - set this to true to bypass email verification
  // Alterar para false em produção para habilitar a verificação de email
  const DISABLE_EMAIL_VERIFICATION = true;

  useEffect(() => {
    // First setup the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error);
        throw { error }; // Forward the error for custom handling
      }
      // We don't need to return data, just ensure the function returns void
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local session state
    setSession(null);
    setUser(null);
  };

  const signOut = logout;

  const signup = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) throw error;
  };

  const register = async (formData: RegisterFormData) => {
    const { email, password, ...profileData } = formData;
    
    try {
      setLoading(true);
      
      console.log('Registrando com papel:', profileData.role);
      console.log('URL de origem:', window.location.origin);
      
      // Preparar os parâmetros de registro com opções corretamente tipadas
      const signUpParams = {
        email,
        password,
        options: {
          data: profileData,
          // Sempre definir a URL de redirecionamento, independente da verificação de email
          emailRedirectTo: `${window.location.origin}/login`
        } 
      };
      
      console.log('Parâmetros de registro:', JSON.stringify(signUpParams, null, 2));
      
      // Usar os parâmetros de registro estruturados corretamente
      const { error, data } = await supabase.auth.signUp(signUpParams);
      
      if (error) {
        console.error('Erro durante o registro:', error);
        // Check if error is due to email or document duplication
        if (error.message.includes('email') && error.message.includes('already')) {
          throw new Error('Este e-mail já está cadastrado');
        }
        if (error.message.includes('document') || error.message.includes('CPF')) {
          throw new Error('Este CPF já está cadastrado');
        }
        throw error;
      }

      console.log('Registro bem-sucedido:', data);
      console.log('Identidade confirmada:', data.user?.identities);
      console.log('Email confirmado:', data.user?.email_confirmed_at);

      // Para testes sem verificação de email, podemos fazer login automático
      if (DISABLE_EMAIL_VERIFICATION) {
        console.log('Verificação de email desativada, fazendo login direto');
        // Mostrar diálogo de confirmação de qualquer forma
        setConfirmationEmail(email);
        setShowEmailConfirmation(true);
      } else {
        // Fluxo normal - mostrar diálogo de confirmação
        setConfirmationEmail(email);
        setShowEmailConfirmation(true);
      }
    } catch (error: any) {
      console.error('Erro detalhado durante o registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) throw error;
  };

  const updateOnboardingStatus = async (status: boolean) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_onboarding_complete: status })
        .eq('id', user.id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      throw error;
    }
  };

  const closeConfirmationDialog = () => {
    setShowEmailConfirmation(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        login,
        logout,
        signup,
        resetPassword,
        updatePassword,
        register,
        signInWithGoogle,
        updateOnboardingStatus,
        signOut, // Add signOut as an alias
      }}
    >
      {children}
      
      {/* The EmailConfirmationDialog will be rendered by the RegisterForm instead */}
    </AuthContext.Provider>
  );
}
