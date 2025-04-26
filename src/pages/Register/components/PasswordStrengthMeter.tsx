
import React, { useEffect, useState } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      
      if (!password) {
        setStrength(0);
        setLabel('');
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
      
      setStrength(score);
      
      // Set label based on score
      if (score === 0) setLabel('');
      else if (score === 1) setLabel('Muito fraca');
      else if (score === 2) setLabel('Fraca');
      else if (score === 3) setLabel('Média');
      else if (score === 4) setLabel('Forte');
      else setLabel('Muito forte');
    };
    
    calculateStrength();
  }, [password]);

  // Don't show the meter for empty passwords
  if (!password) return null;

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
