
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordRequirementsProps {
  passwordRequirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const PasswordRequirements = ({ passwordRequirements }: PasswordRequirementsProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-sm text-blue-700 font-medium">
        Requisitos de segurança
      </AlertDescription>
      <ul className="mt-2 text-sm space-y-1">
        <li className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-600'}`}>
          <span className={`mr-2 text-lg ${passwordRequirements.length ? '✓' : '•'}`}></span>
          Pelo menos 8 caracteres
        </li>
        <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
          <span className={`mr-2 text-lg ${passwordRequirements.uppercase ? '✓' : '•'}`}></span>
          Uma letra maiúscula
        </li>
        <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
          <span className={`mr-2 text-lg ${passwordRequirements.lowercase ? '✓' : '•'}`}></span>
          Uma letra minúscula
        </li>
        <li className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-600'}`}>
          <span className={`mr-2 text-lg ${passwordRequirements.number ? '✓' : '•'}`}></span>
          Um número
        </li>
        <li className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-600'}`}>
          <span className={`mr-2 text-lg ${passwordRequirements.special ? '✓' : '•'}`}></span>
          Um caractere especial (!@#$%^&*()_+...)
        </li>
      </ul>
    </Alert>
  );
};
