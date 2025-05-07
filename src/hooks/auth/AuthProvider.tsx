
import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { EmailConfirmationDialog } from './EmailConfirmationDialog';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  
  const { 
    session, 
    user, 
    loading, 
    setLoading 
  } = useAuthState();

  const { 
    login,
    logout,
    signup,
    resetPassword,
    updatePassword,
    register,
    signInWithGoogle,
    updateOnboardingStatus: baseUpdateOnboardingStatus
  } = useAuthActions({ 
    setLoading, 
    setShowEmailConfirmation, 
    setConfirmationEmail 
  });

  // Wrap the updateOnboardingStatus to automatically pass the user
  const updateOnboardingStatus = async (status: boolean) => {
    return baseUpdateOnboardingStatus(status, user);
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
      }}
    >
      {children}
      
      <EmailConfirmationDialog
        open={showEmailConfirmation}
        onClose={closeConfirmationDialog}
        email={confirmationEmail}
      />
    </AuthContext.Provider>
  );
}
