
import { Badge } from "@/components/ui/badge";

interface PlansHeaderProps {
  subscription?: {
    plan_name: string;
    expires_at: string;
  } | null;
}

export const PlansHeader = ({ subscription }: PlansHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
        Planos e Benefícios
      </h1>
      <p className="text-lg text-muted-foreground">
        Escolha o plano ideal para suas necessidades e comece a crescer conosco
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
