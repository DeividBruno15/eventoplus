
import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, metadata?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateOnboardingStatus: (status: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const register = async (formData: any) => {
    const { email, password, ...profileData } = formData;
    
    // Ensure role is one of the valid options (contractor, provider, advertiser)
    const validatedRole = ["contractor", "provider", "advertiser"].includes(profileData.role) 
      ? profileData.role 
      : "contractor";
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...profileData,
            role: validatedRole,  // Use validated role
          },
        },
      });
      
      if (error) throw error;

      // Show confirmation dialog
      setConfirmationEmail(email);
      setShowEmailConfirmation(true);
    } catch (error) {
      console.error('Error during registration:', error);
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

      <Dialog open={showEmailConfirmation} onOpenChange={closeConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro realizado com sucesso!</DialogTitle>
            <DialogDescription>
              Enviamos um e-mail de confirmação para <strong>{confirmationEmail}</strong>. 
              Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Se você não receber o e-mail em poucos minutos, verifique sua pasta de spam ou lixo eletrônico.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link to="/login">Ir para login</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
