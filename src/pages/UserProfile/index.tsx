
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { ProfileContent } from "./components/ProfileContent";
import { useUserProfileData } from "./hooks/useUserProfileData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserEvents } from "./components/UserEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRatings } from "./components/UserRatings";

const UserProfile = () => {
  const { id } = useParams();
  const { profileData, isLoading, error } = useUserProfileData(id || "");
  const [activeTab, setActiveTab] = useState("sobre");

  useEffect(() => {
    // Scroll to top when profile loads
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Usuário não encontrado</h2>
        <p className="text-gray-600 mb-6">
          O perfil que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        <UserProfileHeader profile={profileData} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre">
            <ProfileContent profile={profileData} />
          </TabsContent>
          
          <TabsContent value="eventos">
            <UserEvents userId={profileData.id} />
          </TabsContent>
          
          <TabsContent value="avaliacoes">
            <UserRatings userId={profileData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
