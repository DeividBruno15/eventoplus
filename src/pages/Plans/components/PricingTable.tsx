
import { BadgeCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plan } from "../types";

interface PricingTableProps {
  plans: Plan[];
}

export const PricingTable = ({ plans }: PricingTableProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan, index) => {
        const isPopular = index === 1;
        
        return (
          <Card 
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              isPopular && "border-primary shadow-lg scale-105"
            )}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(2).replace('.', ',')}`}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <ul className="space-y-3">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    {isPopular ? (
                      <Star className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <BadgeCheck className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className={cn(
                  "w-full", 
                  isPopular ? "bg-primary" : "bg-muted text-muted-foreground hover:bg-muted/90"
                )}
              >
                Assinar {plan.name}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
