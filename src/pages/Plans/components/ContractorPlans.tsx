
import { Plan } from "../types";
import { PlanCard } from "./PlanCard";

interface ContractorPlansProps {
  plans: Plan[];
  onSubscribe: (planId: string) => Promise<void>;
  isSubscribing: boolean;
}

export const ContractorPlans = ({ plans, onSubscribe, isSubscribing }: ContractorPlansProps) => {
  return (
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
  );
};
