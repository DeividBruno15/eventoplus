
import { Check, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plan } from "@/pages/Plans/types";

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  isSubscribing: boolean;
  onSelect: (plan: Plan) => void;
}

export const PlanCard = ({ plan, isCurrentPlan, isSubscribing, onSelect }: PlanCardProps) => {
  return (
    <Card 
      className={`${
        plan.featured 
          ? 'border-primary shadow-md relative overflow-hidden' 
          : ''
      } ${
        isCurrentPlan ? 'bg-muted' : ''
      }`}
    >
      {plan.featured && (
        <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 text-xs">
          <Zap className="h-4 w-4 inline mr-1" />
          RECOMENDADO
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 bg-secondary text-secondary-foreground py-1 px-3 text-xs">
          PLANO ATUAL
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {plan.name}
          {plan.featured && <Zap className="h-5 w-5 text-primary" />}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">
            {plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(2)}`}
          </span>
          {plan.price > 0 && <span className="text-sm text-muted-foreground">/mês</span>}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {plan.benefits.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={plan.featured ? 'default' : 'outline'}
          onClick={() => onSelect(plan)}
          disabled={isCurrentPlan || isSubscribing}
        >
          {isSubscribing 
            ? 'Processando...'
            : isCurrentPlan 
              ? 'Plano atual' 
              : plan.price === 0 
                ? 'Selecionar plano gratuito' 
                : 'Assinar plano'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};
