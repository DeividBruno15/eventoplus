
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Building,
  Calendar,
  Edit,
  Loader2,
  MessageSquare,
  Star,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import VenueReservationCalendar from './components/VenueReservationCalendar';
import { useVenueReservations } from './hooks/useVenueReservations';

interface Venue {
  id: string;
  title: string;
  description: string;
  venue_type: string;
  price_per_hour: number;
  image_url: string | null;
  created_at: string;
  views: number;
  user_id: string;
}

interface Reservation {
  id: string;
  user_id: string;
  venue_id: string;
  reservation_date: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'canceled';
  created_at: string;
  user_name?: string;
  user_email?: string;
  payment_id?: string;
}

const ManageVenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      fetchVenueDetails();
      fetchReservations();
    }
  }, [id, user]);

  const fetchVenueDetails = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('venue_announcements')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Verificar se o usuário é o proprietário
      if (data.user_id !== user?.id) {
        toast.error('Você não tem permissão para gerenciar este local');
        navigate('/venues/manage');
        return;
      }
      
      setVenue(data as Venue);
    } catch (error) {
      console.error('Erro ao buscar detalhes do local:', error);
      toast.error('Erro ao carregar informações do local');
      navigate('/venues/manage');
    }
  };

  const fetchReservations = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Buscar reservas
      const { data, error } = await supabase
        .from('venue_reservations')
        .select(`
          *,
          profiles:user_id (
            name:first_name,
            email
          )
        `)
        .eq('venue_id', id)
        .order('reservation_date', { ascending: false });
        
      if (error) throw error;
      
      // Formatar dados com informações do usuário
      const formattedReservations = data.map((reservation: any) => ({
        ...reservation,
        user_name: reservation.profiles?.name || 'Usuário',
        user_email: reservation.profiles?.email || '-',
      }));
      
      setReservations(formattedReservations);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast.error('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    setProcessingId(reservationId);
    try {
      const { error } = await supabase
        .from('venue_reservations')
        .update({ status: newStatus })
        .eq('id', reservationId);
        
      if (error) throw error;
      
      // Atualizar lista de reservas
      setReservations(reservations.map(res => 
        res.id === reservationId ? { ...res, status: newStatus as any } : res
      ));
      
      toast.success(`Status da reserva atualizado para ${getStatusLabel(newStatus)}`);
      
      // Enviar notificação para o usuário
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        await supabase.from('notifications').insert({
          user_id: reservation.user_id,
          title: `Reserva ${getStatusLabel(newStatus).toLowerCase()}`,
          content: `A reserva para ${venue?.title} foi ${getStatusLabel(newStatus).toLowerCase()}`,
          type: 'reservation_update',
          link: `/venues/details/${id}`
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da reserva');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'confirmed': 'Confirmada',
      'rejected': 'Rejeitada',
      'canceled': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const statusColorMap: Record<string, string> = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-green-500',
      'rejected': 'bg-red-500',
      'canceled': 'bg-gray-500'
    };
    return statusColorMap[status] || 'bg-gray-500';
  };

  const handleDateSelection = (dates: Date[]) => {
    setSelectedDates(dates);
  };
  
  // Se não houver local ou o usuário não estiver autenticado
  if (!venue || !user) {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header com informações do local */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/venues/manage')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{venue.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>
              {venue.venue_type} • {venue.views} visualizações
            </span>
          </div>
        </div>

        <div className="ml-auto space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/venues/details/${venue.id}`)}
          >
            Ver anúncio
          </Button>
          <Button
            onClick={() => navigate(`/venues/edit/${venue.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reservations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Reservas</CardTitle>
              <CardDescription>
                Visualize e gerencie as reservas para este local
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium mt-4">Nenhuma reserva encontrada</h3>
                  <p className="text-muted-foreground mt-2">
                    Este local ainda não possui reservas
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">
                            {format(new Date(reservation.reservation_date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-medium">{reservation.user_name}</div>
                              <div className="text-xs text-muted-foreground">{reservation.user_email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant="outline"
                              className={`${getStatusColor(reservation.status)} text-white`}
                            >
                              {getStatusLabel(reservation.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {reservation.status === 'pending' && (
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  disabled={!!processingId}
                                  onClick={() => handleStatusChange(reservation.id, 'rejected')}
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                  {processingId === reservation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Rejeitar'}
                                </Button>
                                <Button 
                                  size="sm"
                                  disabled={!!processingId}  
                                  onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                >
                                  {processingId === reservation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
                                </Button>
                              </div>
                            )}
                            {reservation.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={!!processingId}
                                onClick={() => handleStatusChange(reservation.id, 'canceled')}
                              >
                                {processingId === reservation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancelar'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Disponibilidade</CardTitle>
              <CardDescription>
                Visualize e gerencie as datas disponíveis para reserva
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <VenueReservationCalendar 
                  venueId={venue.id}
                  onSelectionChange={handleDateSelection}
                  isOwner={true}
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Legenda</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">Reservado/Indisponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm">Dias selecionados</span>
                    </div>
                  </div>
                </div>
                
                {selectedDates.length > 0 && (
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Dias selecionados</h3>
                    <div className="max-h-[200px] overflow-y-auto">
                      <ul className="space-y-1">
                        {selectedDates
                          .sort((a, b) => a.getTime() - b.getTime())
                          .map((date, index) => (
                            <li key={index} className="text-sm flex justify-between">
                              <span>
                                {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        Marcar como indisponível
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Integrações de calendário</h3>
                  <p className="text-sm text-muted-foreground">
                    Sincronize seu calendário para bloquear datas automaticamente e evitar sobreposições.
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      Conectar ao Google Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageVenueDetails;
