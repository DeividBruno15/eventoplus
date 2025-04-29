
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateEventForm } from './components/CreateEventForm';
import DashboardLayout from '@/layouts/DashboardLayout';

const CreateEvent = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Criar Novo Evento</CardTitle>
              <CardDescription>
                Preencha os detalhes do seu evento para encontrar prestadores de serviço qualificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateEventForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;
