
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const InfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre o WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Nossa integração com WhatsApp permite que você receba notificações importantes
          diretamente no seu telefone.
        </p>
        <p>
          Você receberá mensagens sobre:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Novos eventos</li>
          <li>Aprovação de aplicações</li>
          <li>Atualizações de assinatura</li>
          <li>Novas avaliações</li>
          <li>Mensagens diretas</li>
        </ul>
        <p className="text-muted-foreground">
          Você pode desativar as notificações a qualquer momento usando o botão acima.
        </p>
      </CardContent>
    </Card>
  );
};
