
import { Plan } from "../types";
import { PlanCard } from "./PlanCard";

interface AdvertiserPlansProps {
  plans: Plan[];
  onSubscribe: (planId: string) => Promise<void>;
  isSubscribing: boolean;
}

export const AdvertiserPlans = ({ plans, onSubscribe, isSubscribing }: AdvertiserPlansProps) => {
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
