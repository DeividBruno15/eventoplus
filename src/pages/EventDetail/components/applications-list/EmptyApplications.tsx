
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const EmptyApplications = () => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Candidaturas</h3>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertTitle>Nenhuma candidatura</AlertTitle>
          <AlertDescription>
            Ainda não há prestadores de serviços interessados neste evento.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
