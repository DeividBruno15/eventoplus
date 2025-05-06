
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface VenueRulesProps {
  rules: string | null;
}

export const VenueRules = ({ rules }: VenueRulesProps) => {
  if (!rules) return null;
  
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Regras do local</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {rules}
        </p>
      </div>
    </>
  );
};
