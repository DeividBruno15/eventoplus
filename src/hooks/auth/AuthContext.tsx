
import { createContext } from 'react';
import { AuthContextType } from './types';

// Create a context for authentication
export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  register: async () => {},
  signInWithGoogle: async () => {},
  updateOnboardingStatus: async () => {},
  signOut: async () => {},
  updateUserPreferences: async () => {},
});
