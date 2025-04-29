import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { createEventSchema } from '../schema';
import { CreateEventFormData } from '@/types/events';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { BasicEventFields } from './BasicEventFields';
import { LocationServiceFields } from './LocationServiceFields';
import { DescriptionField } from './DescriptionField';
import { ServiceSelectionField } from './ServiceSelectionField';
import { ImageUploadField } from './ImageUploadField';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserCompany } from '@/types/profile';

export function CreateEventForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createEvent, loading } = useCreateEvent();
  const [userCompanies, setUserCompanies] = useState<UserCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      event_time: '',
      zipcode: '',
      location: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      service_requests: [{ category: '', count: 1, price: 0 }],
      image: null
    }
  });
  
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

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      // Verificar se todos os serviços têm categoria
      if (data.service_requests && data.service_requests.length > 0) {
        const hasEmptyCategory = data.service_requests.some(service => !service.category);
        if (hasEmptyCategory) {
          toast.error('Todos os serviços devem ter uma categoria selecionada');
          return;
        }
      }
      
      // Validar a data do evento (não pode ser anterior a hoje)
      if (data.event_date) {
        const [day, month, year] = data.event_date.split('/').map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          toast.error('A data do evento não pode ser anterior ao dia atual');
          return;
        }
      }
      
      await createEvent(data);
      toast.success('Evento criado com sucesso!');
      navigate('/events');
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast.error(error.message || 'Ocorreu um erro ao criar o evento. Tente novamente.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {userCompanies.length > 0 && (
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
        )}
        
        <BasicEventFields form={form} />
        <Separator />
        
        <LocationServiceFields form={form} />
        <Separator />
        
        <DescriptionField form={form} />
        <Separator />
        
        <ServiceSelectionField form={form} />
        <Separator />
        
        <ImageUploadField form={form} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/events')}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Evento'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
