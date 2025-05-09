
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountSettings } from './components/AccountSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { NotificationSettings } from './components/NotificationSettings';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DeleteCompanyDialog } from '@/components/profile/DeleteCompanyDialog';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const handleDeleteAccount = async () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteAccount = async () => {
    if (!user?.id) return;
    
    setSubmitting(true);
    
    try {
      // First delete user data from all tables
      // This depends on the tables in your database
      await supabase.from('user_profiles').delete().eq('id', user.id);
      
      // Delete the auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        throw error;
      }
      
      // Sign out the user
      await signOut();
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente.",
      });
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erro ao excluir conta",
        description: error.message || "Não foi possível excluir sua conta.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
      setShowDeleteDialog(false);
    }
  };
  
  return (
    <div className="container py-6 md:py-10 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings 
              onDeleteAccount={handleDeleteAccount} 
              loading={submitting} 
            />
          </TabsContent>
        </div>
      </Tabs>
      
      <DeleteCompanyDialog
        company={null}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteAccount}
        submitting={submitting}
      />
    </div>
  );
};

export default Settings;
