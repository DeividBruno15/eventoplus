
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { PasswordRequirements } from '@/pages/Register/components/PasswordRequirements';

interface SecuritySettingsProps {
  onDeleteAccount: () => void;
  loading: boolean;
}

export const SecuritySettings = ({ onDeleteAccount, loading }: SecuritySettingsProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  
  // Use the password validation hook
  const validation = usePasswordValidation();
  
  // This is needed to satisfy TypeScript - we know these properties exist on the validation object
  const { 
    passwordRequirements, 
    allRequirementsMet,
    passwordStrength, 
    strengthLabel 
  } = validation;
  
  const validatePasswordInput = () => {
    if (validation.validatePassword) {
      validation.validatePassword(newPassword);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setChangeSuccess(false);
    
    if (!allRequirementsMet) {
      setError('A senha não atende a todos os requisitos de segurança');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setChanging(true);
    
    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (result) {
        setChangeSuccess(true);
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError('Não foi possível alterar a senha. Verifique se a senha atual está correta.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar senha');
    } finally {
      setChanging(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Segurança</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas configurações de segurança e proteção da conta
        </p>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Atualize sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordChange}>
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePasswordInput();
                }}
                required
              />
              
              <PasswordRequirements 
                requirements={passwordRequirements}
                passwordStrength={passwordStrength}
                strengthLabel={strengthLabel}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            
            {changeSuccess && (
              <div className="text-sm text-green-600">
                Senha alterada com sucesso!
              </div>
            )}
            
            <Button
              type="submit"
              disabled={changing || !allRequirementsMet || !newPassword || !currentPassword || newPassword !== confirmPassword}
              variant={changeSuccess ? "outline" : "default"}
            >
              {changing ? 'Alterando...' : changeSuccess ? 'Senha Alterada' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start">
          <h4 className="text-sm font-medium mb-2">Excluir Conta</h4>
          <p className="text-sm text-muted-foreground mb-4">
            A exclusão da conta é permanente. Todos os seus dados serão apagados.
          </p>
          <Button variant="destructive" onClick={onDeleteAccount} disabled={loading}>
            {loading ? 'Excluindo...' : 'Excluir Conta'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
