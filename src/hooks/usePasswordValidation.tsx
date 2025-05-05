
import { useState, useEffect } from 'react';

export interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function usePasswordValidation(password: string) {
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  useEffect(() => {
    // Check password requirements
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
    
    // Calculate password strength
    let score = 0;
    
    if (!password) {
      setPasswordStrength(0);
      setStrengthLabel('');
      return;
    }
    
    // Award points for length
    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;
    
    // Award points for complexity
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Penalize repetition
    if (/(.)\1\1/.test(password)) score -= 1;
    
    // Make sure score is at least 0
    score = Math.max(0, score);
    
    // Cap at 5
    score = Math.min(5, score);
    
    setPasswordStrength(score);
    
    // Set label based on score
    if (score === 0) setStrengthLabel('');
    else if (score === 1) setStrengthLabel('Muito fraca');
    else if (score === 2) setStrengthLabel('Fraca');
    else if (score === 3) setStrengthLabel('Média');
    else if (score === 4) setStrengthLabel('Forte');
    else setStrengthLabel('Muito forte');
  }, [password]);

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req === true);

  return {
    passwordRequirements,
    allRequirementsMet,
    passwordStrength,
    strengthLabel
  };
}
