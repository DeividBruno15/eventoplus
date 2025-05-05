
import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  // Don't show the meter for empty passwords
  if (!password) return null;

  // Calculate strength based on password length and complexity
  let strength = 0;
  let label = '';
  
  // Award points for length
  if (password.length >= 8) strength += 1;
  if (password.length >= 10) strength += 1;
  
  // Award points for complexity
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  // Penalize repetition
  if (/(.)\1\1/.test(password)) strength -= 1;
  
  // Make sure score is at least 0
  strength = Math.max(0, strength);
  
  // Cap at 5
  strength = Math.min(5, strength);
  
  // Set label based on score
  if (strength === 0) label = '';
  else if (strength === 1) label = 'Muito fraca';
  else if (strength === 2) label = 'Fraca';
  else if (strength === 3) label = 'Média';
  else if (strength === 4) label = 'Forte';
  else label = 'Muito forte';

  const getColor = () => {
    if (strength === 0 || strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  // Calculate width percentage based on strength
  const widthPercent = (strength / 5) * 100;

  return (
    <div className="space-y-1 w-full">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      {label && (
        <p className="text-xs text-gray-500 text-right">{label}</p>
      )}
    </div>
  );
};
