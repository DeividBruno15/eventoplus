
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateEventForm } from './components/CreateEventForm';

const CreateEvent = () => {
  return (
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
  );
};

export default CreateEvent;
