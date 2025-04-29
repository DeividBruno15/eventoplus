
import { useState, useEffect } from 'react';
import { FormLabel } from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventFormData } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { UserCompany } from '@/types/profile';

interface UserCompanySelectorProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const UserCompanySelector = ({ form }: UserCompanySelectorProps) => {
  const { user } = useAuth();
  const [userCompanies, setUserCompanies] = useState<UserCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Fetch user companies
  useEffect(() => {
    if (!user) return;
    
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        
        // Cast to any to workaround type incompatibility until types are updated
        const { data, error } = await (supabase as any)
          .from('user_companies')
          .select('*')
          .eq('user_id', user.id)
          .order('name');
          
        if (error) throw error;
        
        setUserCompanies(data as UserCompany[] || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, [user]);

  const handleCompanySelect = (companyId: string) => {
    const company = userCompanies.find(c => c.id === companyId);
    if (!company) return;
    
    // Update form fields with company data
    form.setValue('zipcode', company.zipcode);
    form.setValue('street', company.street);
    form.setValue('number', company.number);
    form.setValue('neighborhood', company.neighborhood);
    form.setValue('city', company.city);
    form.setValue('state', company.state);
    
    // Format location
    const location = `${company.street}, ${company.number} - ${company.neighborhood}, ${company.city}-${company.state}`;
    form.setValue('location', location);
    
    // Trigger validation
    form.trigger(['zipcode', 'street', 'number', 'neighborhood', 'city', 'state', 'location']);
  };

  if (userCompanies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <FormLabel>Empresa (opcional)</FormLabel>
      <Select onValueChange={handleCompanySelect}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma empresa (opcional)" />
        </SelectTrigger>
        <SelectContent>
          {userCompanies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Selecione uma empresa para preencher automaticamente o endereço
      </p>
    </div>
  );
};
