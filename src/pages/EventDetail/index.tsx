
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    handleApproveApplication 
  } = useEventApplications(event);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
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
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
