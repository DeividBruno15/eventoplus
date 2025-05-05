
import { Plan } from "../types";
import { PlanCard } from "./PlanCard";

interface ProviderPlansProps {
  plans: Plan[];
  onSubscribe: (planId: string) => Promise<void>;
  isSubscribing: boolean;
}

export const ProviderPlans = ({ plans, onSubscribe, isSubscribing }: ProviderPlansProps) => {
  return (
    <div>
      <div className="mb-8 max-w-3xl mx-auto">
        <p className="text-center text-muted-foreground">
          Como prestador de serviços, você pode mostrar seu trabalho e ser encontrado por 
          potenciais clientes. Escolha o plano que melhor se adapta ao seu negócio e comece 
          a expandir sua rede de clientes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onSubscribe={onSubscribe} 
            isSubscribing={isSubscribing} 
          />
        ))}
      </div>
    </div>
  );
};
