
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Building,
  Calendar,
  BarChart,
  Star,
  MessageSquare,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VenueItem {
  id: string;
  title: string;
  venue_type: string;
  price_per_hour: number;
  views: number;
  image_url: string | null;
  created_at: string;
  ratings_count: number;
  avg_rating: number | null;
  pending_reservations: number;
}

const ManageVenues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<VenueItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchUserVenues();
  }, [user, navigate]);

  const fetchUserVenues = async () => {
    setLoading(true);
    try {
      // Buscar os anúncios do usuário com contagem de avaliações e média
      const { data: venueData, error } = await supabase
        .from('venue_announcements')
        .select(`
          id, 
          title, 
          venue_type, 
          price_per_hour, 
          views, 
          image_url, 
          created_at
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Para cada anúncio, busca as estatísticas complementares
      const venuesWithStats = await Promise.all(
        venueData.map(async (venue) => {
          // Buscar contagem e média de avaliações
          const { data: ratingData, error: ratingError } = await supabase
            .from('venue_ratings')
            .select('overall_rating', { count: 'exact' })
            .eq('venue_id', venue.id);

          if (ratingError) throw ratingError;

          const avgRating = ratingData && ratingData.length > 0
            ? ratingData.reduce((sum, item) => sum + parseFloat(item.overall_rating), 0) / ratingData.length
            : null;

          // Buscar número de reservas pendentes
          const { count: pendingCount, error: reservationError } = await supabase
            .from('venue_reservations')
            .select('id', { count: 'exact' })
            .eq('venue_id', venue.id)
            .eq('status', 'pending');

          if (reservationError) throw reservationError;

          return {
            ...venue,
            ratings_count: ratingData?.length || 0,
            avg_rating: avgRating,
            pending_reservations: pendingCount || 0
          };
        })
      );

      setVenues(venuesWithStats);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
      toast.error('Erro ao carregar seus locais');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async () => {
    if (!selectedVenue) return;
    
    setDeleteLoading(true);
    try {
      // Verificar se há reservas ativas
      const { count, error: reservationError } = await supabase
        .from('venue_reservations')
        .select('id', { count: 'exact' })
        .eq('venue_id', selectedVenue.id)
        .in('status', ['confirmed', 'pending']);
        
      if (reservationError) throw reservationError;
      
      if (count && count > 0) {
        toast.error('Não é possível excluir um local com reservas ativas');
        setDeleteDialogOpen(false);
        return;
      }
      
      // Excluir o anúncio
      const { error } = await supabase
        .from('venue_announcements')
        .delete()
        .eq('id', selectedVenue.id);
        
      if (error) throw error;
      
      toast.success('Local excluído com sucesso');
      setVenues(venues.filter(v => v.id !== selectedVenue.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir local:', error);
      toast.error('Erro ao excluir o local');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getVenueTypeLabel = (type: string) => {
    const venueTypes: Record<string, string> = {
      party_hall: 'Salão de Festas',
      wedding_venue: 'Espaço para Casamentos',
      corporate_space: 'Espaço Corporativo',
      studio: 'Estúdio',
      restaurant: 'Restaurante',
      beach_club: 'Beach Club',
      farm: 'Fazenda/Sítio',
      mansion: 'Casa/Mansão',
      sports_venue: 'Espaço Esportivo',
      garden: 'Jardim/Área Externa',
      other: 'Outro'
    };
    
    return venueTypes[type] || type;
  };

  if (!user) {
    return null; // Redirect será realizado pelo useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Locais</h1>
          <p className="text-muted-foreground">
            Gerencie seus espaços anunciados
          </p>
        </div>
        <Button onClick={() => navigate('/venues/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo local
        </Button>
      </div>

      <Separator />
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : venues.length === 0 ? (
        <Card className="p-8 text-center">
          <Building className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold mt-4">Nenhum local encontrado</h2>
          <p className="text-muted-foreground mt-2">
            Você ainda não criou nenhum anúncio de local.
          </p>
          <Button onClick={() => navigate('/venues/create')} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Criar meu primeiro anúncio
          </Button>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Local</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-center">Visualizações</TableHead>
                <TableHead className="text-center">Avaliação</TableHead>
                <TableHead className="text-center">Reservas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-10 w-10 rounded bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: venue.image_url ? `url(${venue.image_url})` : 'url(/placeholder.jpg)' }}
                      />
                      <div className="truncate">
                        <div className="font-medium truncate">{venue.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Criado em {new Date(venue.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getVenueTypeLabel(venue.venue_type)}</TableCell>
                  <TableCell>R$ {venue.price_per_hour.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center">
                      <BarChart className="h-4 w-4 mr-1 text-muted-foreground" />
                      {venue.views}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      {venue.avg_rating ? venue.avg_rating.toFixed(1) : '-'} 
                      <span className="text-xs text-muted-foreground ml-1">
                        ({venue.ratings_count})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {venue.pending_reservations > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 mr-1">
                          {venue.pending_reservations}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/venues/details/${venue.id}`)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/venues/edit/${venue.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/venues/manage/${venue.id}`)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Reservas
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedVenue(venue);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o local "{selectedVenue?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteVenue}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageVenues;
