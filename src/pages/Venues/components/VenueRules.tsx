
import { Card } from "@/components/ui/card";

interface VenueRulesProps {
  rules: string | null;
}

export const VenueRules = ({ rules }: VenueRulesProps) => {
  if (!rules) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Regras do Local</h2>
      
      <Card className="p-6">
        <div className="prose max-w-none">
          {rules.split('\n').map((rule, index) => (
            <p key={index} className={index > 0 ? "mt-2" : ""}>
              {rule}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};
