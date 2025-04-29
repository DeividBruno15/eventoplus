
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserCompany } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Pencil, Trash, Building, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchAddressByCep, formatCep } from '@/utils/cep';
import { toast } from 'sonner';

interface CompanyFormValues {
  name: string;
  zipcode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

const initialFormValues: CompanyFormValues = {
  name: '',
  zipcode: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
};

export function UserCompanies() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CompanyFormValues>(initialFormValues);
  const [saving, setSaving] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  
  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Use a direct query with any to avoid type issues
      // This is a workaround until the Supabase types are updated
      const { data, error } = await supabase
        .from('user_companies' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Cast the data to our known type
      setCompanies(data as unknown as UserCompany[] || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zipcode') {
      const formattedZipcode = formatCep(value);
      setFormValues({ ...formValues, [name]: formattedZipcode });
      
      // If we have a complete CEP, fetch the address
      if (formattedZipcode.replace(/\D/g, '').length === 8) {
        fetchAddressData(formattedZipcode);
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  
  const fetchAddressData = async (cep: string) => {
    setFetchingAddress(true);
    try {
      const addressData = await fetchAddressByCep(cep);
      if (addressData) {
        setFormValues(prev => ({
          ...prev,
          street: addressData.street || prev.street,
          neighborhood: addressData.neighborhood || prev.neighborhood,
          city: addressData.city || prev.city,
          state: addressData.state || prev.state,
        }));
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Erro ao buscar endereço pelo CEP');
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleOpenDialog = (company?: UserCompany) => {
    if (company) {
      setIsEdit(true);
      setCurrentCompanyId(company.id);
      setFormValues({
        name: company.name,
        zipcode: company.zipcode,
        street: company.street,
        number: company.number,
        neighborhood: company.neighborhood,
        city: company.city,
        state: company.state,
      });
    } else {
      setIsEdit(false);
      setCurrentCompanyId(null);
      setFormValues(initialFormValues);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setFormValues(initialFormValues);
    }, 300);
  };

  const validateForm = () => {
    const requiredFields = ['name', 'zipcode', 'street', 'number', 'neighborhood', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !formValues[field as keyof CompanyFormValues]);
    
    if (missingFields.length > 0) {
      toast.error(`Preencha todos os campos obrigatórios`);
      return false;
    }
    
    // Validate zipcode format
    const zipcode = formValues.zipcode.replace(/\D/g, '');
    if (zipcode.length !== 8) {
      toast.error('CEP inválido');
      return false;
    }
    
    return true;
  };

  const handleSaveCompany = async () => {
    if (!user) return;
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const companyData = {
        ...formValues,
        user_id: user.id,
      };
      
      if (isEdit && currentCompanyId) {
        // Type assertion for the database table
        const { error } = await supabase
          .from('user_companies' as any)
          .update(companyData)
          .eq('id', currentCompanyId);
        
        if (error) throw error;
        toast.success('Empresa atualizada com sucesso');
      } else {
        // Type assertion for the database table
        const { error } = await supabase
          .from('user_companies' as any)
          .insert([companyData]);
        
        if (error) throw error;
        toast.success('Empresa adicionada com sucesso');
      }
      
      // Refresh companies and close dialog
      fetchCompanies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Erro ao salvar empresa');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    
    try {
      setLoading(true);
      // Type assertion for the database table
      const { error } = await supabase
        .from('user_companies' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Empresa excluída com sucesso');
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Erro ao excluir empresa');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Minhas Empresas</CardTitle>
          <CardDescription>Gerencie suas empresas para criar eventos</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Minhas Empresas</CardTitle>
          <CardDescription>Gerencie suas empresas para criar eventos</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Nova Empresa
        </Button>
      </CardHeader>
      
      <CardContent>
        {companies.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <Building className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Nenhuma empresa cadastrada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione empresas para facilitar a criação de eventos
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <div key={company.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{company.name}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(company)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="text-sm text-muted-foreground">
                  <p>{company.street}, {company.number}</p>
                  <p>{company.neighborhood} - {company.city}/{company.state}</p>
                  <p>CEP: {company.zipcode}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Company Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Editar Empresa' : 'Adicionar Empresa'}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? 'Atualize os dados da empresa selecionada' 
                : 'Preencha os dados para cadastrar uma nova empresa'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Nome da empresa" 
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="zipcode">CEP</Label>
              <Input 
                id="zipcode" 
                name="zipcode" 
                placeholder="00000-000" 
                value={formValues.zipcode}
                onChange={handleInputChange}
                maxLength={9}
              />
              {fetchingAddress && <p className="text-xs text-primary">Buscando endereço...</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="street">Logradouro</Label>
                <Input 
                  id="street" 
                  name="street" 
                  placeholder="Rua, Avenida, etc" 
                  value={formValues.street}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="number">Número</Label>
                <Input 
                  id="number" 
                  name="number" 
                  placeholder="123" 
                  value={formValues.number}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input 
                id="neighborhood" 
                name="neighborhood" 
                placeholder="Bairro" 
                value={formValues.neighborhood}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city" 
                  name="city" 
                  placeholder="Cidade" 
                  value={formValues.city}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="state">Estado</Label>
                <Input 
                  id="state" 
                  name="state" 
                  placeholder="UF" 
                  value={formValues.state}
                  onChange={handleInputChange}
                  maxLength={2}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSaveCompany}
              disabled={saving || fetchingAddress}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
