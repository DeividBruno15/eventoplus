import { useEffect, useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAddressByCep } from '@/utils/cep';
import { UserCompany } from '@/types/companies';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

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

export type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  editingCompany: UserCompany | null;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

export const CompanyForm = ({ 
  editingCompany, 
  onSubmit, 
  onCancel, 
  submitting 
}: CompanyFormProps) => {
  const [lookingUpZipcode, setLookingUpZipcode] = useState(false);
  
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

  // Update form values when editing company changes
  useEffect(() => {
    if (editingCompany) {
      form.reset({
        name: editingCompany.name,
        zipcode: editingCompany.zipcode,
        street: editingCompany.street,
        number: editingCompany.number,
        neighborhood: editingCompany.neighborhood,
        city: editingCompany.city,
        state: editingCompany.state,
      });
    } else {
      form.reset({
        name: '',
        zipcode: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
      });
    }
  }, [editingCompany, form]);

  const handleZipcodeChange = async (value: string) => {
    const zipcode = value.replace(/\D/g, '');
    form.setValue('zipcode', zipcode);
    
    if (zipcode.length === 8) {
      setLookingUpZipcode(true);
      try {
        const result = await fetchAddressByCep(zipcode);
        
        if (result) {
          form.setValue('street', result.street || '');
          form.setValue('neighborhood', result.neighborhood || '');
          form.setValue('city', result.city || '');
          form.setValue('state', result.state || '');
          
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
  
  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
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
            onClick={onCancel}
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
  );
};
