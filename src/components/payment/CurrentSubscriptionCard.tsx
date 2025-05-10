
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CheckCircle } from 'lucide-react';

interface CurrentSubscriptionCardProps {
  planName: string;
  expiresAt: string;
}

export const CurrentSubscriptionCard = ({ planName, expiresAt }: CurrentSubscriptionCardProps) => {
  const isActive = new Date(expiresAt) > new Date();
  
  return (
    <Card className="bg-muted/50 mb-6 border border-primary/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 text-primary mr-2" />
          Sua assinatura atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg">{planName}</h3>
            {isActive && (
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
