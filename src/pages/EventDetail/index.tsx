
import { useParams } from 'react-router-dom';
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

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const { 
    event, 
    applications, 
    userRole, 
    loading, 
    userHasApplied, 
    userApplication 
  } = useEventDetails({ id, user });
  
  const { 
    submitting, 
    handleApply, 
    handleApproveApplication 
  } = useEventApplications(event);

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !event ? (
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EventInfo event={event} />
            
            <div className="lg:col-span-1">
              {userRole === 'provider' && 
               (event.status === 'open' || event.status === 'published') && (
                <ApplicationForm 
                  event={event}
                  onSubmit={handleApply}
                  userApplication={userApplication}
                  submitting={submitting}
                />
              )}
              
              {userRole === 'contractor' && 
               event.contractor_id === user?.id && (
                <ApplicationsList 
                  applications={applications}
                  onApprove={handleApproveApplication}
                  submitting={submitting}
                  eventStatus={event.status}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
