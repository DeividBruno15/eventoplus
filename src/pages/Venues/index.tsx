
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface VenueAnnouncement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  venue_name: string;
  created_at: string;
  views: number;
  venue_type: string;
  price_per_hour: number;
  address?: string;
  social_links?: {
    type: string;
    url: string;
  }[];
}

// Define the structure of what Supabase returns for user_venues
interface UserVenue {
  name: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

const VenuesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<VenueAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('venue_announcements')
          .select(`
            id, 
            title, 
            description,
            image_url,
            venue_type,
            price_per_hour,
            created_at,
            views,
            venue_id,
            social_links,
            user_venues(name, street, number, neighborhood, city, state)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Formata os dados para o formato esperado pelo componente
        const formattedData = data?.map(item => {
          const venueData = item.user_venues as unknown as UserVenue;
          // Format address if venue data exists
          const address = venueData ? 
            `${venueData.street}, ${venueData.number} - ${venueData.neighborhood}, ${venueData.city}/${venueData.state}` : 
            undefined;

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            image_url: item.image_url,
            // Fix the type issue here - accessing the venue name properly
            venue_name: venueData ? venueData.name : 'Local não especificado',
            created_at: item.created_at,
            views: item.views,
            venue_type: item.venue_type,
            price_per_hour: item.price_per_hour,
            address: address,
            social_links: item.social_links
          };
        }) || [];
        
        setAnnouncements(formattedData);
      } catch (error) {
        console.error('Error fetching venue announcements:', error);
        toast.error('Falha ao carregar anúncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meus Anúncios</h2>
          <p className="text-muted-foreground">
            Gerencie os anúncios dos seus espaços para eventos
          </p>
        </div>
        <Button 
          onClick={() => navigate('/venues/create')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Criar Anúncio
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-3 w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="h-48 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: announcement.image_url ? `url(${announcement.image_url})` : undefined }}
              />
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {announcement.description}
                </p>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-xs text-gray-600">Local: {announcement.venue_name}</p>
                  {announcement.address && (
                    <p className="text-xs text-gray-600 line-clamp-1">
                      Endereço: {announcement.address}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">Tipo: {announcement.venue_type}</p>
                  <p className="text-sm font-semibold text-primary">
                    R$ {announcement.price_per_hour.toFixed(2)}/dia
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {announcement.views} visualizações
                  </span>
                </div>
                
                {/* Social Media Links */}
                {announcement.social_links && announcement.social_links.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {announcement.social_links.map((link, index) => (
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
                )}
              </CardContent>
              <CardFooter className="border-t p-4 bg-gray-50">
                <div className="w-full flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/venues/details/${announcement.id}`)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate(`/venues/edit/${announcement.id}`)}
                  >
                    Editar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-white">
          <div className="text-center max-w-md space-y-4">
            <h3 className="text-xl font-medium">Nenhum anúncio encontrado</h3>
            <p className="text-muted-foreground">
              Você ainda não tem nenhum anúncio cadastrado. Crie seu primeiro anúncio 
              para promover seu espaço para eventos.
            </p>
            <Button 
              onClick={() => navigate('/venues/create')}
              className="mt-4"
            >
              Criar meu primeiro anúncio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to get social media icon based on type
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

export default VenuesPage;
