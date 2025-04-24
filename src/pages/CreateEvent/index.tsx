import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const createEventSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório e deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Por favor, forneça uma descrição detalhada do evento (min. 10 caracteres)'),
  event_date: z.string().min(1, 'A data do evento é obrigatória'),
  event_time: z.string().min(1, 'O horário do evento é obrigatório'),
  location: z.string().min(5, 'O local do evento é obrigatório (min. 5 caracteres)'),
  service_type: z.string().min(3, 'O tipo de serviço é obrigatório (min. 3 caracteres)'),
  max_attendees: z.string().optional().transform(val => val === '' ? null : parseInt(val, 10)),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      service_type: '',
      max_attendees: '',
    },
  });
  
  const onSubmit = async (data: CreateEventFormData) => {
    if (!user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para criar um evento",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      
      // Combinar data e hora para armazenar
      const eventDate = new Date(`${data.event_date}T${data.event_time}`);
      
      const { data: eventData, error } = await supabase
        .from('events')
        .insert({
          name: data.name,
          description: data.description,
          event_date: eventDate.toISOString(),
          location: data.location,
          service_type: data.service_type,
          max_attendees: data.max_attendees,
          contractor_id: user.id,
          status: 'open'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Evento criado com sucesso!",
        description: "Seu evento foi publicado e já está disponível para candidaturas.",
      });
      
      const eventId = (eventData as { id: string }).id;
      navigate(`/events/${eventId}`);
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast({
        title: "Erro ao criar evento",
        description: error.message || 'Ocorreu um erro ao criar seu evento',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Criar Novo Evento</CardTitle>
              <CardDescription>
                Preencha os detalhes do seu evento para encontrar prestadores de serviço qualificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome do Evento*</Label>
                  <Input 
                    id="name"
                    placeholder="Ex.: Casamento de João e Maria"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event_date">Data do Evento*</Label>
                    <Input 
                      id="event_date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...form.register('event_date')}
                    />
                    {form.formState.errors.event_date && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="event_time">Horário*</Label>
                    <Input 
                      id="event_time"
                      type="time"
                      {...form.register('event_time')}
                    />
                    {form.formState.errors.event_time && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_time.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Local do Evento*</Label>
                  <Input 
                    id="location"
                    placeholder="Ex.: Salão de Festas Primavera, Rua das Flores, 123 - São Paulo, SP"
                    {...form.register('location')}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="service_type">Tipo de Serviço*</Label>
                  <Input 
                    id="service_type"
                    placeholder="Ex.: Buffet, Decoração, Fotografia, DJ"
                    {...form.register('service_type')}
                  />
                  {form.formState.errors.service_type && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.service_type.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="max_attendees">Número de Convidados (opcional)</Label>
                  <Input 
                    id="max_attendees"
                    type="number"
                    placeholder="Ex.: 100"
                    min="1"
                    {...form.register('max_attendees')}
                  />
                  {form.formState.errors.max_attendees && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.max_attendees.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição do Evento*</Label>
                  <Textarea 
                    id="description"
                    placeholder="Descreva detalhes do evento, necessidades específicas, orçamento estimado, etc."
                    rows={5}
                    {...form.register('description')}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>
                
                <div className="flex gap-4 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/events')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full"
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
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEvent;
