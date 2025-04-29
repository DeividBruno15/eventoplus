
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserCompany } from '@/types/companies';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useCompanies() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch companies on component mount
  useEffect(() => {
    if (user) {
      fetchCompanies();
    }
  }, [user]);
  
  const fetchCompanies = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // TypeScript will complain because user_companies isn't in the generated types yet
      // We need to use type assertions to work around this until the types are updated
      const response = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', user.id)
        .order('name') as { data: UserCompany[] | null, error: any };
      
      if (response.error) throw response.error;
      
      setCompanies(response.data || []);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData: { user_id: string } & Omit<UserCompany, 'id' | 'created_at'>) => {
    try {
      setSubmitting(true);
      
      const response = await supabase
        .from('user_companies')
        .insert([companyData]) as { data: UserCompany[] | null, error: any };
        
      if (response.error) throw response.error;
      
      toast.success('Empresa adicionada com sucesso');
      await fetchCompanies();
      return true;
    } catch (error: any) {
      toast.error(`Erro: ${error.message || 'Ocorreu um erro ao salvar a empresa'}`);
      console.error('Error adding company:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateCompany = async (id: string, companyData: { user_id: string } & Omit<UserCompany, 'id' | 'created_at'>) => {
    try {
      setSubmitting(true);
      
      const response = await supabase
        .from('user_companies')
        .update(companyData)
        .eq('id', id) as { data: UserCompany[] | null, error: any };
        
      if (response.error) throw response.error;
      
      toast.success('Empresa atualizada com sucesso');
      await fetchCompanies();
      return true;
    } catch (error: any) {
      toast.error(`Erro: ${error.message || 'Ocorreu um erro ao atualizar a empresa'}`);
      console.error('Error updating company:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      setSubmitting(true);
      
      const response = await supabase
        .from('user_companies')
        .delete()
        .eq('id', id) as { data: any, error: any };
      
      if (response.error) throw response.error;
      
      toast.success('Empresa removida com sucesso');
      await fetchCompanies();
      return true;
    } catch (error: any) {
      toast.error(`Erro: ${error.message || 'Ocorreu um erro ao excluir a empresa'}`);
      console.error('Error deleting company:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    companies,
    loading,
    submitting,
    addCompany,
    updateCompany,
    deleteCompany,
  };
}
