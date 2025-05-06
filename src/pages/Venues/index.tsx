import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";

interface VenueAnnouncement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  venue_name: string;
  created_at: string;
  views: number;
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
        // This is a placeholder - the actual query would depend on your database structure
        const { data, error } = await supabase
          .from('venue_announcements')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setAnnouncements(data || []);
      } catch (error) {
        console.error('Error fetching venue announcements:', error);
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
                <p className="text-xs text-gray-500">Local: {announcement.venue_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {announcement.views} visualizações
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-gray-50">
                <div className="w-full flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/venues/${announcement.id}`)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate(`/venues/${announcement.id}/edit`)}
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

export default VenuesPage;
