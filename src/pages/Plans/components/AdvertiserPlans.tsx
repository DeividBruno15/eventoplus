
import { Plan } from "../types";
import { PlanCard } from "./PlanCard";

interface AdvertiserPlansProps {
  plans: Plan[];
  onSubscribe: (planId: string) => Promise<void>;
  isSubscribing: boolean;
  currentPlanId?: string;
}

export const AdvertiserPlans = ({ plans, onSubscribe, isSubscribing, currentPlanId }: AdvertiserPlansProps) => {
  return (
    <div>
      <div className="mb-8 max-w-3xl mx-auto">
        <p className="text-center text-muted-foreground">
          Anuncie seus espaços para eventos na nossa plataforma e aumente sua visibilidade.
          Nossos planos para anunciantes são ideais para proprietários de locais que desejam 
          conectar-se com organizadores de eventos e aumentar suas reservas.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onSubscribe={onSubscribe} 
            isSubscribing={isSubscribing}
            isCurrentPlan={plan.id === currentPlanId}
          />
        ))}
      </div>
    </div>
  );
};
