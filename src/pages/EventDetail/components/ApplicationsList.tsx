import { useNavigate } from 'react-router-dom'; 
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Check, X } from 'lucide-react';
import { EventApplication } from '@/types/events';
import { Separator } from '@/components/ui/separator';
import { getApplicationStatusColor } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface ApplicationsListProps {
  applications: EventApplication[];
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  submitting: boolean;
  eventStatus: string;
}

interface ProviderProfile {
  avatar_url?: string | null;
  service_categories?: string[] | null;
}

export const ApplicationsList = ({ applications, onApprove, submitting, eventStatus }: ApplicationsListProps) => {
  const navigate = useNavigate();
  const [providerProfiles, setProviderProfiles] = useState<Record<string, ProviderProfile>>({});
  
  // Fetch provider profiles with avatars
  useEffect(() => {
    const fetchProviderProfiles = async () => {
      if (!applications.length) return;
      
      const providerIds = applications.map(app => app.provider_id);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, avatar_url')
        .in('id', providerIds);
        
      if (error) {
        console.error('Error fetching provider profiles:', error);
        return;
      }
      
      const profiles = data.reduce((acc, profile) => {
        acc[profile.id] = {
          avatar_url: profile.avatar_url,
        };
        return acc;
      }, {} as Record<string, ProviderProfile>);
      
      setProviderProfiles(profiles);
    };
    
    fetchProviderProfiles();
  }, [applications]);
  
  const handleViewProfile = (providerId: string) => {
    navigate(`/provider/${providerId}`);
  };
  
  const handleRejectApplication = (applicationId: string) => {
    // Implement rejection logic here
    console.log('Rejecting application:', applicationId);
  };
  
  const getProviderInitials = (app: EventApplication) => {
    if (!app.provider) return 'U';
    const { first_name, last_name } = app.provider;
    return `${first_name.charAt(0)}${last_name ? last_name.charAt(0) : ''}`.toUpperCase();
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium text-lg mb-4">Candidaturas</h3>
        
        {applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            Ainda não há candidaturas para este evento
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {providerProfiles[app.provider_id]?.avatar_url ? (
                        <AvatarImage 
                          src={providerProfiles[app.provider_id].avatar_url || ''} 
                          alt={app.provider?.first_name || 'Provider'} 
                        />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getProviderInitials(app)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <span className="font-medium">
                        {app.provider ? `${app.provider.first_name} ${app.provider.last_name}` : 'Usuário'}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {app.provider?.email || 'Sem email'}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getApplicationStatusColor(app.status)} text-white`}
                  >
                    {app.status === 'pending' ? 'Pendente' : 
                     app.status === 'accepted' ? 'Aprovada' : 
                     app.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
                  </Badge>
                </div>
                
                <p className="text-sm whitespace-pre-line border-l-2 pl-3 py-1 border-gray-200 bg-gray-50 mb-4">
                  {app.message}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(app.provider_id)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Ver perfil completo
                  </Button>
                
                  {app.status === 'pending' && (eventStatus === 'open' || eventStatus === 'published') && (
                    <>
                      <Button 
                        onClick={() => onApprove(app.id, app.provider_id)}
                        disabled={submitting}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            Aprovando...
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Aprovar
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={() => handleRejectApplication(app.id)}
                        disabled={submitting}
                        size="sm"
                        variant="destructive"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  
                  {app.status === 'accepted' && (
                    <Button 
                      onClick={() => navigate('/chat')}
                      size="sm"
                    >
                      Conversar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
