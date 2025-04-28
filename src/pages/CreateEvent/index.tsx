
import { CreateEventForm } from './components/CreateEventForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/contexts/SessionContext';
import { Navigate } from 'react-router-dom';

const CreateEvent = () => {
  const { session } = useSession();
  
  // Redirect if not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a contractor
  const userRole = session?.user?.user_metadata?.role;
  if (userRole !== 'contractor') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Criar novo evento</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os detalhes do seu novo evento
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do evento</CardTitle>
          <CardDescription>
            Preencha todas as informações necessárias para criar seu evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateEventForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
