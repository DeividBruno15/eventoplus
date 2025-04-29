
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventInfo } from './components/EventInfo';
import { ApplicationForm } from './components/ApplicationForm';
import { ApplicationsList } from './components/ApplicationsList';
import { useEventDetails } from './hooks/useEventDetails';
import { useEventApplications } from './hooks/useEventApplications';
import { ImageUpload } from './components/ImageUpload';
import { DeleteEvent } from './components/DeleteEvent';
import DashboardLayout from '@/layouts/DashboardLayout';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    event, 
    applications, 
    userRole, 
    loading, 
    userHasApplied, 
    userApplication,
    refetchEvent 
  } = useEventDetails({ id, user });
  
  const { 
    submitting, 
    handleApply, 
    handleApproveApplication,
    handleCancelApplication
  } = useEventApplications(event);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-medium mb-2">Evento não encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Este evento pode ter sido removido ou você não tem permissão para acessá-lo.
              </p>
              <Button onClick={() => navigate('/events')}>
                Voltar para eventos
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <EventInfo event={event} />
          
          {userRole === 'contractor' && event.contractor_id === user?.id && (
            <div className="p-6 border-t flex flex-wrap gap-4">
              <ImageUpload 
                event={event} 
                userId={user?.id} 
                onSuccess={refetchEvent} 
              />
              <DeleteEvent event={event} userId={user?.id} />
            </div>
          )}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {userRole === 'provider' && (
            <div>
              <ApplicationForm 
                event={event}
                onSubmit={handleApply}
                userApplication={userApplication}
                submitting={submitting}
              />
            </div>
          )}
          
          {userRole === 'contractor' && 
           event.contractor_id === user?.id && (
            <div>
              <ApplicationsList 
                applications={applications}
                onApprove={handleApproveApplication}
                submitting={submitting}
                eventStatus={event.status}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventDetail;
