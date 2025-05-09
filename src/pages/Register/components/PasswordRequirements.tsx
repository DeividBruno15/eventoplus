
import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { PasswordRequirements as PasswordReqs } from '@/hooks/usePasswordValidation';

export interface PasswordRequirementsProps {
  requirements: PasswordReqs;
  passwordStrength: number;
  strengthLabel: string;
}

export const PasswordRequirements = ({ 
  requirements, 
  passwordStrength, 
  strengthLabel 
}: PasswordRequirementsProps) => {
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-200";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-lime-500";
      case 5: return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className="mt-2 space-y-3 text-sm">
      {/* Password strength meter */}
      <div>
        <div className="flex justify-between mb-1">
          <span>Força da senha:</span>
          <span className="font-medium">{strengthLabel}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full transition-all ${getStrengthColor()}`} 
            style={{ width: `${(passwordStrength / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Requirements checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          {requirements.length ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-300" />
          )}
          <span className={requirements.length ? "text-green-700" : "text-gray-500"}>
            Mínimo 8 caracteres
          </span>
        </div>
        <div className="flex items-center gap-2">
          {requirements.uppercase ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-300" />
          )}
          <span className={requirements.uppercase ? "text-green-700" : "text-gray-500"}>
            Uma letra maiúscula
          </span>
        </div>
        <div className="flex items-center gap-2">
          {requirements.lowercase ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-300" />
          )}
          <span className={requirements.lowercase ? "text-green-700" : "text-gray-500"}>
            Uma letra minúscula
          </span>
        </div>
        <div className="flex items-center gap-2">
          {requirements.number ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-300" />
          )}
          <span className={requirements.number ? "text-green-700" : "text-gray-500"}>
            Um número
          </span>
        </div>
        <div className="flex items-center gap-2">
          {requirements.special ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-300" />
          )}
          <span className={requirements.special ? "text-green-700" : "text-gray-500"}>
            Um caractere especial
          </span>
        </div>
      </div>
    </div>
  );
};
