
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { consultarCep } from '@/utils/cep';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserCompany } from '@/types/profile';

// Form validation schema
const companySchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  zipcode: z.string().min(8, "CEP deve ter 8 dígitos"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export const UserCompanies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lookingUpZipcode, setLookingUpZipcode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCompany, setEditingCompany] = useState<UserCompany | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<UserCompany | null>(null);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      zipcode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
    }
  });
  
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
      
      const { data, error } = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) throw error;
      
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };
  
  const handleZipcodeChange = async (value: string) => {
    const zipcode = value.replace(/\D/g, '');
    form.setValue('zipcode', zipcode);
    
    if (zipcode.length === 8) {
      setLookingUpZipcode(true);
      try {
        const result = await consultarCep(zipcode);
        
        if (result) {
          form.setValue('street', result.logradouro || '');
          form.setValue('neighborhood', result.bairro || '');
          form.setValue('city', result.localidade || '');
          form.setValue('state', result.uf || '');
          
          // Trigger validation
          form.trigger(['street', 'neighborhood', 'city', 'state']);
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setLookingUpZipcode(false);
      }
    }
  };
  
  const onSubmit = async (values: CompanyFormValues) => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      const companyData = {
        user_id: user.id,
        ...values
      };
      
      let response;
      
      if (editingCompany) {
        response = await supabase
          .from('user_companies')
          .update(companyData)
          .eq('id', editingCompany.id);
      } else {
        response = await supabase
          .from('user_companies')
          .insert([companyData]);
      }
      
      if (response.error) throw response.error;
      
      toast.success(editingCompany ? 'Empresa atualizada com sucesso' : 'Empresa adicionada com sucesso');
      fetchCompanies();
      closeDialog();
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditCompany = (company: UserCompany) => {
    setEditingCompany(company);
    
    // Set form values
    form.reset({
      name: company.name,
      zipcode: company.zipcode,
      street: company.street,
      number: company.number,
      neighborhood: company.neighborhood,
      city: company.city,
      state: company.state,
    });
    
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (company: UserCompany) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!companyToDelete) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('user_companies')
        .delete()
        .eq('id', companyToDelete.id);
      
      if (error) throw error;
      
      toast.success('Empresa removida com sucesso');
      fetchCompanies();
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setSubmitting(false);
      setIsDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };
  
  const openDialog = () => {
    setEditingCompany(null);
    form.reset({
      name: '',
      zipcode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
    });
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    form.reset();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Minhas Empresas</h3>
          <Button onClick={openDialog} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Empresa
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Você ainda não tem empresas cadastradas.</p>
            <p className="text-sm mt-2">
              Adicione empresas para facilitar a criação de eventos.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div 
                key={company.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{company.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {company.street}, {company.number} - {company.neighborhood}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {company.city}, {company.state} - CEP {company.zipcode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditCompany(company)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClick(company)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add/Edit Company Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? 'Editar Empresa' : 'Adicionar Empresa'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome da empresa" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="00000-000" 
                          {...field} 
                          onChange={(e) => handleZipcodeChange(e.target.value)}
                          maxLength={9}
                          disabled={lookingUpZipcode}
                        />
                        {lookingUpZipcode && (
                          <div className="absolute right-3 top-2.5">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" {...field} maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeDialog}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCompany ? 'Atualizando...' : 'Salvando...'}
                    </>
                  ) : (
                    editingCompany ? 'Atualizar' : 'Salvar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a empresa "{companyToDelete?.name}"?
              <br/>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
