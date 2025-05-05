
import { Badge } from "@/components/ui/badge";

interface PlansHeaderProps {
  subscription?: {
    plan_name: string;
    expires_at: string;
  } | null;
  userRole?: string | null;
}

export const PlansHeader = ({ subscription, userRole }: PlansHeaderProps) => {
  const getRoleSpecificMessage = () => {
    if (userRole === 'advertiser') {
      return "Escolha o plano ideal para anunciar seus espaços e conectar-se com organizadores de eventos";
    } else if (userRole === 'provider') {
      return "Escolha o plano ideal para oferecer seus serviços e ser encontrado por mais clientes";
    } else {
      return "Escolha o plano ideal para suas necessidades e comece a crescer conosco";
    }
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
        Planos e Benefícios
      </h1>
      <p className="text-lg text-muted-foreground">
        {getRoleSpecificMessage()}
      </p>
      {subscription && (
        <div className="mt-4">
          <Badge variant="subscription" className="px-3 py-1 text-base">
            Você possui o plano <strong>{subscription.plan_name}</strong> ativo até {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
          </Badge>
        </div>
      )}
    </div>
  );
};
