
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VenueDetails {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  venue_name: string;
  venue_id: string;
  max_capacity: number;
  price_per_hour: number; // Used as price per day
  is_rentable: boolean;
  amenities: string[];
  rules: string | null;
  external_link: string | null;
  views: number;
  venue_type: string;
  created_at: string;
  available_dates?: string[];
  social_links?: {
    type: string;
    url: string;
  }[];
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

const VenueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<VenueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('venue_announcements')
          .select(`
            *,
            user_venues(name, street, number, neighborhood, city, state, zipcode)
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Parse available dates if they exist
          const parsedDates = data.available_dates 
            ? data.available_dates.map((dateStr: string) => new Date(dateStr))
            : [];
            
          setAvailableDates(parsedDates);
          
          // Format the venue data with address information
          const venueData = data.user_venues ? {
            ...data,
            venue_name: data.user_venues.name,
            address: {
              street: data.user_venues.street,
              number: data.user_venues.number,
              neighborhood: data.user_venues.neighborhood,
              city: data.user_venues.city,
              state: data.user_venues.state,
              zipcode: data.user_venues.zipcode
            }
          } : data;
          
          setVenue(venueData);
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
        toast.error('Erro ao carregar detalhes do anúncio');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  // Social media icon component
  const getSocialMediaIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'instagram':
        return <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </span>;
      case 'facebook':
        return <span className="bg-blue-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </span>;
      case 'twitter':
        return <span className="bg-blue-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
        </span>;
      case 'tiktok':
        return <span className="bg-black text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
            <path d="M13 12V8a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4V5"></path>
            <line x1="13" y1="5" x2="13" y2="12"></line>
          </svg>
        </span>;
      default:
        return <span className="bg-gray-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </span>;
    }
  };
  
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
          <div className="h-64 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-2/3" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Anúncio não encontrado</h2>
          <p className="text-muted-foreground">
            O anúncio que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate('/venues')}>
            Voltar para meus anúncios
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user && venue.user_id === user.id;
  const formattedAddress = venue.address ? 
    `${venue.address.street}, ${venue.address.number} - ${venue.address.neighborhood}, ${venue.address.city}/${venue.address.state}` : 
    'Endereço não disponível';

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/venues")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para anúncios
        </Button>
        
        {isOwner && (
          <Button 
            onClick={() => navigate(`/venues/edit/${venue.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar anúncio
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div 
              className="h-64 md:h-96 rounded-lg bg-gray-100 bg-cover bg-center mb-4"
              style={{ backgroundImage: venue.image_url ? `url(${venue.image_url})` : undefined }}
            />
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Badge variant="outline">{venue.venue_type}</Badge>
              <span>•</span>
              <span>{venue.views} visualizações</span>
            </div>
            
            <h1 className="text-3xl font-bold">{venue.title}</h1>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{formattedAddress}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Capacidade para {venue.max_capacity} pessoas</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Sobre o espaço</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {venue.description}
            </p>
          </div>
          
          {venue.amenities && venue.amenities.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{getAmenityLabel(amenity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
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
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Informações de preço</h2>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold">R$ {venue.price_per_hour.toFixed(2)}</span>
              <span className="text-gray-500">/ dia</span>
            </div>
            
            {venue.is_rentable ? (
              <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                Disponível para aluguel
              </Badge>
            ) : (
              <Badge className="mb-4 bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
                Não disponível para aluguel
              </Badge>
            )}
            
            <Button className="w-full">Entrar em contato</Button>
            
            {venue.social_links && venue.social_links.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Redes sociais</h3>
                <div className="flex gap-2">
                  {venue.social_links.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      {getSocialMediaIcon(link.type)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Disponibilidade</h2>
            {availableDates.length > 0 ? (
              <CalendarComponent
                mode="multiple"
                selected={availableDates}
                className="pointer-events-auto"
                locale={ptBR}
                disabled={(date) => !availableDates.some(d => 
                  format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                )}
                readOnly
              />
            ) : (
              <p className="text-gray-500">
                Nenhuma data específica foi definida para disponibilidade.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to get amenity label
const getAmenityLabel = (amenityId: string): string => {
  const amenitiesMap: Record<string, string> = {
    parking: "Estacionamento",
    wifi: "Wi-Fi",
    restrooms: "Banheiros",
    stage: "Palco",
    aircon: "Ar-condicionado",
    kitchen: "Cozinha",
    sound: "Sistema de som",
    lighting: "Iluminação",
  };
  
  return amenitiesMap[amenityId] || amenityId;
};

export default VenueDetailsPage;
