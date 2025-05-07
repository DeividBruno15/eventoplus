
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
  onSubscribe: (planId: string) => Promise<void>;
  isSubscribing: boolean;
  isCurrentPlan?: boolean;
}

export const PlanCard = ({ plan, onSubscribe, isSubscribing, isCurrentPlan = false }: PlanCardProps) => {
  return (
    <Card key={plan.id} className={`${plan.featured ? 'border-primary shadow-lg' : ''} flex flex-col ${isCurrentPlan ? 'bg-gray-50 border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{plan.name}</span>
          {plan.featured && <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">RECOMENDADO</span>}
          {isCurrentPlan && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">ATUAL</span>}
        </CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isCurrentPlan ? "outline" : plan.featured ? "default" : "outline"}
          onClick={() => onSubscribe(plan.id)}
          disabled={isSubscribing || isCurrentPlan}
        >
          {isSubscribing ? "Processando..." : isCurrentPlan ? "Plano Atual" : "Assinar Plano"}
        </Button>
      </CardFooter>
    </Card>
  );
};
