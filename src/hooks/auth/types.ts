
import { Session, User } from '@supabase/supabase-js';
import { RegisterFormData } from '@/pages/Register/types';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, metadata?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateOnboardingStatus: (status: boolean) => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
}
