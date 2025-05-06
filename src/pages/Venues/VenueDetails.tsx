import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash, Instagram, Facebook, Twitter } from "lucide-react";

interface VenueDetails {
  id: string;
  title: string;
  description: string;
  venue_type: string;
  price_per_hour: number;
  max_capacity: number;
  is_rentable: boolean;
  amenities: string[];
  rules: string | null;
  external_link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  available_dates: string[];
  user_id: string;
  social_links: Array<{
    type: string;
    url: string;
  }> | null;
  venue: {
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  } | null; // Mark venue as potentially null
}

const amenityLabels: Record<string, string> = {
  "parking": "Estacionamento",
  "wifi": "Wi-Fi",
  "restrooms": "Banheiros",
  "stage": "Palco",
  "aircon": "Ar-condicionado",
  "kitchen": "Cozinha",
  "sound": "Sistema de som",
  "lighting": "Iluminação"
};

const venueTypeLabels: Record<string, string> = {
  "party_hall": "Salão de festas",
  "concert_hall": "Casa de shows",
  "outdoor_space": "Espaço aberto",
  "auditorium": "Auditório",
  "wedding_venue": "Espaço para casamentos",
  "conference_room": "Sala de conferências"
};

const getSocialMediaIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-5 w-5" />;
    case 'facebook':
      return <Facebook className="h-5 w-5" />;
    case 'twitter':
      return <Twitter className="h-5 w-5" />;
    default:
      return null;
  }
};

const VenueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState<VenueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('venue_announcements')
          .select(`
            *,
            venue:venue_id(name, street, number, neighborhood, city, state, zipcode)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setVenue(data as unknown as VenueDetails);
        
        if (data.available_dates && Array.isArray(data.available_dates)) {
          const dates = data.available_dates.map(dateStr => parseISO(dateStr));
          setSelectedDates(dates);
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
        toast.error('Falha ao carregar os detalhes do local');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenueDetails();
  }, [id]);
  
  const handleDelete = async () => {
    if (!id || !venue) return;
    
    // Check if the current user is the owner
    if (user?.id !== venue.user_id) {
      toast.error("Você não tem permissão para excluir este anúncio");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('venue_announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Anúncio excluído com sucesso");
      navigate('/venues');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/venues')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 animate-pulse rounded w-4/6"></div>
            </div>
          </div>
          
          <Card className="h-80">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!venue) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/venues')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </div>
        
        <Card className="p-10 text-center">
          <h2 className="text-xl font-medium mb-2">Anúncio não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O anúncio que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate('/venues')}>
            Ver meus anúncios
          </Button>
        </Card>
      </div>
    );
  }
  
  const isOwner = user?.id === venue.user_id;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/venues')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para anúncios
        </Button>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/venues/edit/${venue.id}`)}
            >
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  Confirmar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash className="h-4 w-4 mr-1" /> Excluir
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{venue.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">
                {venueTypeLabels[venue.venue_type] || venue.venue_type}
              </Badge>
              <Badge variant="outline">
                Capacidade: {venue.max_capacity} pessoas
              </Badge>
              {venue.is_rentable ? (
                <Badge className="bg-green-600 text-white">Disponível</Badge>
              ) : (
                <Badge variant="destructive">Indisponível</Badge>
              )}
            </div>
          </div>
          
          {venue.image_url && (
            <div className="rounded-lg overflow-hidden h-80 bg-gray-100">
              <img
                src={venue.image_url}
                alt={venue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {venue.description}
            </p>
          </div>
          
          <Separator />
          
          {/* Modificação aqui para verificar se venue.venue existe antes de acessá-lo */}
          {venue.venue && (
            <>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Local</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">{venue.venue.name}</span>
                  </p>
                  <p className="text-gray-700">
                    {venue.venue.street}, {venue.venue.number} - {venue.venue.neighborhood}
                  </p>
                  <p className="text-gray-700">
                    {venue.venue.city}/{venue.venue.state} - CEP: {venue.venue.zipcode}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Comodidades</h2>
            <div className="flex flex-wrap gap-2">
              {venue.amenities && venue.amenities.length > 0 ? (
                venue.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-sm">
                    {amenityLabels[amenity] || amenity}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma comodidade informada</p>
              )}
            </div>
          </div>
          
          {venue.rules && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Regras do local</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {venue.rules}
                </p>
              </div>
            </>
          )}
          
          {venue.social_links && venue.social_links.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Redes sociais</h2>
                <div className="flex gap-4">
                  {venue.social_links.map((link, index) => {
                    const icon = getSocialMediaIcon(link.type);
                    if (!icon) return null;
                    
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full ${
                          link.type === 'instagram' 
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500' 
                            : link.type === 'facebook'
                              ? 'bg-blue-600'
                              : 'bg-blue-400'
                        } text-white`}
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Preço por dia</h3>
                <div className="text-2xl font-bold text-primary">
                  R$ {venue.price_per_hour.toFixed(2)}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Disponibilidade</h3>
                <div className="border rounded-lg p-4">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    className="w-full"
                    locale={ptBR}
                    disabled={(date) => date < new Date()}
                  />
                  
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Os dias destacados são as datas disponíveis para locação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-xs text-gray-500">
            Anúncio criado em {format(new Date(venue.created_at), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsPage;
