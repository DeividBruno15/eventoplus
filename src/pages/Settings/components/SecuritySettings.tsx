
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Lock, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

export const SecuritySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  
  // Último login
  const lastSignIn = user?.last_sign_in_at 
    ? format(new Date(user.last_sign_in_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })
    : 'Não disponível';

  // Device detection
  const userAgent = navigator.userAgent;
  let deviceType = 'Desktop';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/iPad|Tablet/i.test(userAgent)) {
    deviceType = 'Tablet';
  }
  
  // Password validation
  const { 
    isValid: isPasswordValid, 
    errors: passwordErrors,
    validatePassword
  } = usePasswordValidation();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (!validatePassword(newPassword)) {
      return;
    }
    
    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso"
      });
      
      // Limpar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao tentar alterar sua senha",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setDeleteDialogOpen(true);
    setConfirmDeleteText('');
    setDeleteError(null);
  };
  
  const handleFirstDeleteConfirm = () => {
    // Validar se o texto de confirmação está correto
    if (confirmDeleteText !== user?.email) {
      setDeleteError('Por favor, digite seu e-mail corretamente para confirmar');
      return;
    }
    
    // Abrir o diálogo de confirmação secundário
    setDeleteDialogOpen(false);
    setDeleteConfirmDialogOpen(true);
  };

  const handleFinalDeleteConfirm = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        user?.id as string
      );
      
      if (error) throw error;
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso"
      });
      
      // Redirecionar para a página inicial após a exclusão
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Erro ao excluir conta",
        description: error.message || "Ocorreu um erro ao tentar excluir sua conta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setDeleteConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Segurança da Conta
          </CardTitle>
          <CardDescription>
            Gerencie a segurança da sua conta e altere sua senha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informações de segurança */}
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Último login</span>
              <span>{lastSignIn}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Dispositivo</span>
              <span>{deviceType}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Autenticação de dois fatores</span>
              <span className="text-amber-600">Não ativado</span>
            </div>
          </div>

          {/* Alerta de segurança */}
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700">
              Recomendamos que você altere sua senha regularmente para maior segurança.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Atualize sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme a nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente sua nova senha"
              />
            </div>
            
            {/* Exibir erros de validação de senha */}
            {passwordErrors.length > 0 && (
              <ul className="text-sm text-red-500 list-disc pl-5">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            
            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Senha alterada com sucesso!
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              variant={success ? "outline" : "default"}
              className="w-full"
            >
              {loading ? "Alterando..." : success ? "Senha alterada com sucesso!" : "Alterar senha"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive"
            className="w-full mt-4"
            onClick={handleDeleteAccountClick}
          >
            Excluir minha conta
          </Button>
        </CardFooter>
      </Card>
      
      {/* Primeiro diálogo de confirmação para exclusão de conta */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir sua conta?</DialogTitle>
            <DialogDescription>
              Esta ação é irreversível. Sua conta será permanentemente excluída junto com todos os seus dados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Todos os seus dados serão excluídos permanentemente e não poderão ser recuperados.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Digite seu e-mail <strong>{user?.email}</strong> para confirmar:
              </Label>
              <Input
                id="confirm-email"
                value={confirmDeleteText}
                onChange={(e) => setConfirmDeleteText(e.target.value)}
                placeholder="seu-email@exemplo.com"
              />
              
              {deleteError && (
                <p className="text-sm text-destructive">{deleteError}</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="mt-2 sm:mt-0"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleFirstDeleteConfirm}
              disabled={confirmDeleteText !== user?.email}
            >
              Confirmar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Segundo diálogo de confirmação final */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirmação final</DialogTitle>
            <DialogDescription>
              Tem certeza absoluta que deseja excluir permanentemente sua conta?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta é a última confirmação. Após este passo, sua conta será excluída permanentemente.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmDialogOpen(false)}
              className="mt-2 sm:mt-0"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleFinalDeleteConfirm}
              disabled={loading}
            >
              {loading ? "Processando..." : "Excluir permanentemente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
