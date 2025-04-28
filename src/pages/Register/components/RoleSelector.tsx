
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '../types';
import { RoleCard } from './RoleCard';

interface RoleSelectorProps {
  form: UseFormReturn<RegisterFormData>;
  selectedRole: 'contractor' | 'provider';
}

export const RoleSelector = ({ form, selectedRole }: RoleSelectorProps) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-4">Selecione seu perfil</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RoleCard
          role="contractor"
          selected={selectedRole === 'contractor'}
          onClick={() => form.setValue('role', 'contractor')}
        />
        <RoleCard
          role="provider"
          selected={selectedRole === 'provider'}
          onClick={() => form.setValue('role', 'provider')}
        />
      </div>
    </div>
  );
};
