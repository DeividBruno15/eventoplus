
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

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local session state
    setSession(null);
    setUser(null);
  };

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

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) throw error;
  };

  const register = async (formData: RegisterFormData) => {
    const { email, password, ...profileData } = formData;
    
    try {
      setLoading(true);
      
      console.log('Registrando com papel:', profileData.role);
      
      // Use the correct redirect URL format - don't include protocol in the redirect URL
      const redirectTo = `${window.location.origin}/login`;
      console.log('Configurando redirect para:', redirectTo);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profileData,
          emailRedirectTo: redirectTo,
        },
      });
      
      if (error) {
        console.error('Erro durante o registro:', error);
        throw error;
      }

      // Log success for debugging
      console.log('Registro bem-sucedido:', data);

      // Mostrar diálogo de confirmação
      setConfirmationEmail(email);
      setShowEmailConfirmation(true);
    } catch (error) {
      console.error('Erro durante o registro:', error);
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
    <>
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
        }}
      >
        {children}
      </AuthContext.Provider>

      <EmailConfirmationDialog 
        open={showEmailConfirmation} 
        onClose={closeConfirmationDialog} 
        email={confirmationEmail} 
      />
    </>
  );
}
