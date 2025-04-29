
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileHeader } from './components/UserProfileHeader';
import { ProfileContent } from './components/ProfileContent';
import { UserRatings } from './components/UserRatings';
import { UserEvents } from './components/UserEvents';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  role: 'contractor' | 'provider';
  avatar_url: string | null;
  bio: string | null;
  city?: string;
  state?: string;
  companies?: Array<{
    id: string;
    name: string;
  }>;
  services?: Array<{
    id: string;
    category: string;
  }>;
}

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar?: string | null;
}

interface EventCount {
  count: number;
}

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [eventCount, setEventCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        // Fetch basic user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select(`
            id, 
            first_name, 
            last_name, 
            role, 
            avatar_url, 
            bio,
            city,
            state
          `)
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        let userData: UserProfileData = {
          ...profileData as UserProfileData,
          companies: [],
          services: []
        };

        // If contractor, fetch companies
        if (profileData?.role === 'contractor') {
          const { data: companiesData } = await supabase
            .from('user_companies')
            .select('id, name')
            .eq('user_id', id);
            
          if (companiesData) {
            userData.companies = companiesData;
          }
          
          // For contractors, count events
          const { data: eventCountData } = await supabase
            .from('events')
            .select('id', { count: 'exact' })
            .eq('contractor_id', id);

          if (eventCountData) {
            setEventCount(eventCountData.length);
          }
        } 
        // If provider, fetch services
        else if (profileData?.role === 'provider') {
          const { data: servicesData } = await supabase
            .from('provider_services')
            .select('id, category')
            .eq('provider_id', id);
            
          if (servicesData) {
            userData.services = servicesData;
          }
          
          // For providers, count approved applications
          const { data: applicationCountData } = await supabase
            .from('event_applications')
            .select('id', { count: 'exact' })
            .eq('provider_id', id)
            .eq('status', 'accepted');

          if (applicationCountData) {
            setEventCount(applicationCountData.length);
          }
        }

        setUserData(userData);
        
        // Fetch mock ratings for now (in a real app, this would come from a ratings table)
        // This is placeholder data - you would replace with actual ratings from your database
        const mockRatings = [
          {
            id: '1',
            rating: 5,
            comment: 'Excelente profissional! Recomendo.',
            created_at: '2023-04-15T10:30:00Z',
            reviewer_name: 'Maria Silva',
            reviewer_avatar: null
          },
          {
            id: '2',
            rating: 4,
            comment: 'Bom trabalho, entregou o combinado no prazo.',
            created_at: '2023-03-22T14:15:00Z',
            reviewer_name: 'João Santos',
            reviewer_avatar: null
          },
          {
            id: '3',
            rating: 5,
            comment: 'Superou as expectativas! Muito profissional.',
            created_at: '2023-02-10T09:45:00Z',
            reviewer_name: 'Ana Oliveira',
            reviewer_avatar: null
          }
        ];
        
        setRatings(mockRatings);
        
        // Calculate average rating
        if (mockRatings.length > 0) {
          const sum = mockRatings.reduce((acc, rating) => acc + rating.rating, 0);
          setAverageRating(sum / mockRatings.length);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Perfil não encontrado</h2>
        <p className="text-muted-foreground">
          O perfil que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileHeader 
        userData={userData}
        averageRating={averageRating}
        ratingCount={ratings.length}
        eventCount={eventCount}
      />
      
      <Card>
        <Tabs defaultValue="sobre" className="w-full">
          <TabsList className="w-full border-b rounded-none bg-transparent">
            <TabsTrigger value="sobre" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Sobre
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Avaliações ({ratings.length})
            </TabsTrigger>
            <TabsTrigger value="eventos" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              {userData.role === 'contractor' ? 'Eventos' : 'Serviços'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre" className="p-6">
            <ProfileContent userData={userData} />
          </TabsContent>
          
          <TabsContent value="avaliacoes" className="p-6">
            <UserRatings ratings={ratings} />
          </TabsContent>
          
          <TabsContent value="eventos" className="p-6">
            <UserEvents 
              userId={userData.id} 
              userRole={userData.role}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfilePage;
