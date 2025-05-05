
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MapPin, Users, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Venue } from '@/types/venues';

const Venues = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!user) return;
      
      try {
        // Check if venues table exists first
        const { data: tableExists } = await supabase.rpc('check_table_exists', { table_name: 'venues' });
        
        if (!tableExists) {
          setVenues([]);
          setLoading(false);
          return;
        }
        
        // If table exists, proceed with the query
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setVenues(data as Venue[] || []);
      } catch (error: any) {
        console.error('Error fetching venues:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus locais.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenues();
  }, [user, toast]);

  const handleCreateVenue = () => {
    navigate('/venues/create');
  };
  
  const handleEditVenue = (id: string) => {
    navigate(`/venues/${id}/edit`);
  };
  
  const handleViewVenue = (id: string) => {
    navigate(`/venues/${id}`);
  };
  
  const handleDeleteVenue = async (id: string) => {
    // Confirmation dialog would be implemented here
    try {
      // Check if venues table exists first
      const { data: tableExists } = await supabase.rpc('check_table_exists', { table_name: 'venues' });
      
      if (!tableExists) {
        toast({
          title: "Erro",
          description: "A funcionalidade ainda não está disponível.",
          variant: "destructive"
        });
        return;
      }
      
      // If table exists, proceed with the query
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setVenues(venues.filter(venue => venue.id !== id));
      
      toast({
        title: "Local removido",
        description: "O local foi removido com sucesso."
      });
    } catch (error: any) {
      console.error('Error deleting venue:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o local.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string, isApproved: boolean) => {
    if (!isApproved && status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente de aprovação</Badge>;
    } else if (!isApproved && status === 'rejected') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
    } else if (isApproved && status === 'active') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
    } else if (isApproved && status === 'paused') {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pausado</Badge>;
    }
    return <Badge variant="outline">Desconhecido</Badge>;
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Locais</h1>
        <Button onClick={handleCreateVenue}>
          <PlusCircle className="mr-2 h-4 w-4" /> Anunciar Novo Local
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 w-2/3 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{venue.name}</CardTitle>
                <div className="mt-2">
                  {getStatusBadge(venue.status, venue.is_approved)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{venue.city}, {venue.state}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Capacidade: {venue.min_capacity} - {venue.max_capacity} pessoas</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" size="sm" onClick={() => handleViewVenue(venue.id)}>
                  <Eye className="h-4 w-4 mr-1" /> Ver
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditVenue(venue.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteVenue(venue.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium mb-2">Você ainda não tem locais anunciados</h3>
              <p className="text-muted-foreground">
                Comece a anunciar seus locais de eventos para que contratantes possam encontrá-los.
              </p>
            </div>
            <Button onClick={handleCreateVenue}>
              <PlusCircle className="mr-2 h-4 w-4" /> Anunciar meu primeiro local
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Venues;
