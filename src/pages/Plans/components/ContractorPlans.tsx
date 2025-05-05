
import { Plan } from "../types";
import { PlanCard } from "./PlanCard";

interface ContractorPlansProps {
  plans: Plan[];
  onSubscribe: (planId: string) => Promise<void>;
  isSubscribing: boolean;
}

export const ContractorPlans = ({ plans, onSubscribe, isSubscribing }: ContractorPlansProps) => {
  return (
    <div>
      <div className="mb-8 max-w-3xl mx-auto">
        <p className="text-center text-muted-foreground">
          Como contratante, você pode encontrar os melhores profissionais para seus eventos.
          Escolha o plano que melhor se adapta às suas necessidades e comece a organizar 
          eventos incríveis com os melhores prestadores de serviços.
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
