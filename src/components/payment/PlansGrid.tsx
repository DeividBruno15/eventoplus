
import { Plan } from "@/pages/Plans/types";
import { PlanCard } from "./PlanCard";

interface PlansGridProps {
  plans: Plan[];
  currentPlanId: string | null;
  isSubscribing: boolean;
  onSelectPlan: (plan: Plan) => void;
}

export const PlansGrid = ({ plans, currentPlanId, isSubscribing, onSelectPlan }: PlansGridProps) => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={currentPlanId === plan.id}
          isSubscribing={isSubscribing}
          onSelect={onSelectPlan}
        />
      ))}
    </div>
  );
};
