
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const eventTypes = [
  { value: 'wedding', label: 'Casamento' },
  { value: 'birthday', label: 'Aniversário' },
  { value: 'corporate', label: 'Corporativo' },
  { value: 'graduation', label: 'Formatura' },
  { value: 'party', label: 'Festa' },
  { value: 'other', label: 'Outro' },
];

const amenities = [
  { id: 'parking', label: 'Estacionamento' },
  { id: 'kitchen', label: 'Cozinha' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'accessible', label: 'Acessibilidade' },
  { id: 'sound', label: 'Sistema de som' },
  { id: 'light', label: 'Sistema de iluminação' },
  { id: 'stage', label: 'Palco' },
  { id: 'tables', label: 'Mesas e cadeiras' },
  { id: 'generator', label: 'Gerador de energia' },
  { id: 'air_conditioning', label: 'Ar condicionado' },
];

const venueFormSchema = z.object({
  name: z.string().min(3, 'Nome do local é obrigatório e deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descreva seu local com pelo menos 10 caracteres'),
  min_capacity: z.number().min(1, 'A capacidade mínima deve ser pelo menos 1'),
  max_capacity: z.number().min(1, 'A capacidade máxima deve ser pelo menos 1'),
  event_types: z.array(z.string()).min(1, 'Selecione pelo menos um tipo de evento'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zipcode: z.string().min(8, 'CEP é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  amenities: z.array(z.string()),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  price_type: z.string().default('hour'),
  terms_conditions: z.string().optional(),
});

type VenueFormValues = z.infer<typeof venueFormSchema>;

const CreateVenue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: '',
      description: '',
      min_capacity: 10,
      max_capacity: 100,
      event_types: [],
      address: '',
      city: '',
      state: '',
      zipcode: '',
      neighborhood: '',
      amenities: [],
      price_type: 'hour',
    },
  });

  const onSubmit = async (values: VenueFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um local",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform amenities array to JSON object
      const amenitiesObject: Record<string, boolean> = {};
      values.amenities.forEach(item => {
        amenitiesObject[item] = true;
      });

      // Insert venue into database
      const { data, error } = await supabase
        .from('venues')
        .insert({
          user_id: user.id,
          name: values.name,
          description: values.description,
          min_capacity: values.min_capacity,
          max_capacity: values.max_capacity,
          event_types: values.event_types,
          address: values.address,
          city: values.city,
          state: values.state,
          zipcode: values.zipcode,
          neighborhood: values.neighborhood,
          amenities: amenitiesObject,
          price_min: values.price_min,
          price_max: values.price_max,
          price_type: values.price_type,
          terms_conditions: values.terms_conditions,
          status: 'pending',
          is_approved: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Local cadastrado",
        description: "Seu local foi cadastrado com sucesso e está aguardando aprovação.",
      });

      navigate('/venues');
    } catch (error: any) {
      console.error('Error creating venue:', error);
      toast({
        title: "Erro ao cadastrar local",
        description: error.message || "Ocorreu um erro ao cadastrar o local. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cadastrar novo local</h1>
        <p className="text-muted-foreground mt-1">
          Preencha os dados abaixo para anunciar seu espaço para eventos
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium">Informações básicas</h3>
                  <div className="grid gap-6 mt-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Local</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Salão Primavera" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-6 grid-cols-2">
                      <FormField
                        control={form.control}
                        name="min_capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidade Mínima</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="max_capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidade Máxima</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="event_types"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Tipos de Evento</FormLabel>
                            <FormDescription>
                              Selecione os tipos de evento adequados para seu espaço
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {eventTypes.map((type) => (
                              <FormField
                                key={type.value}
                                control={form.control}
                                name="event_types"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={type.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(type.value)}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || [];
                                            return checked
                                              ? field.onChange([...current, type.value])
                                              : field.onChange(
                                                  current.filter((value) => value !== type.value)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {type.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva seu espaço, características, diferenciais..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Localização</h3>
                  <div className="grid gap-6 mt-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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
                    
                    <div className="grid gap-6 grid-cols-2">
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
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="UF" maxLength={2} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Comodidades</h3>
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormDescription>
                            Selecione as comodidades disponíveis no seu espaço
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {amenities.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="amenities"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          return checked
                                            ? field.onChange([...current, item.id])
                                            : field.onChange(
                                                current.filter((value) => value !== item.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Informações de preço</h3>
                  <div className="grid gap-6 mt-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="price_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço mínimo (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="0,00"
                              {...field}
                              onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço máximo (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="0,00"
                              {...field}
                              onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de cobrança</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hour">Por hora</SelectItem>
                              <SelectItem value="day">Por dia</SelectItem>
                              <SelectItem value="event">Por evento</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="terms_conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termos e condições (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Regras específicas do local, horários, restrições..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/venues')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar local"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVenue;
