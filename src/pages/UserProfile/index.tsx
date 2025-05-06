
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileHeader } from './components/UserProfileHeader';
import { ProfileContent } from './components/ProfileContent';
import { UserRatings } from './components/UserRatings';
import { UserEvents } from './components/UserEvents';
import { useUserProfileData } from './hooks/useUserProfileData';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { userData, ratings, eventCount, averageRating, loading, totalRatings } = useUserProfileData(id);

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
        ratingCount={totalRatings}
        eventCount={eventCount}
      />
      
      <Card>
        <Tabs defaultValue="sobre" className="w-full">
          <TabsList className="w-full border-b rounded-none bg-transparent">
            <TabsTrigger value="sobre" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Sobre
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Avaliações ({totalRatings})
            </TabsTrigger>
            <TabsTrigger value="eventos" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              {userData.role === 'contractor' ? 'Eventos' : 'Serviços'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre" className="p-6">
            <ProfileContent userData={userData} />
          </TabsContent>
          
          <TabsContent value="avaliacoes" className="p-6">
            {id && <UserRatings userId={id} />}
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
