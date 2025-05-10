
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrentSubscriptionCardProps {
  planName: string;
  expiresAt: string;
}

export const CurrentSubscriptionCard = ({ planName, expiresAt }: CurrentSubscriptionCardProps) => {
  return (
    <Card className="bg-muted/50 mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Sua assinatura atual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg">{planName}</h3>
            {new Date(expiresAt) > new Date() && (
              <p className="text-sm text-muted-foreground">
                Válido até {new Date(expiresAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Ativo
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
