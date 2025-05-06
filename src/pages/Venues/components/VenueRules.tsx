
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

interface VenueRulesProps {
  rules: string | null;
}

export const VenueRules = ({ rules }: VenueRulesProps) => {
  if (!rules) return null;
  
  // Função para formatar regras como lista se forem separadas por traços ou numeração
  const formatRules = (rulesText: string) => {
    // Check if rules appear to be a list (lines starting with - or numbers)
    const lines = rulesText.split('\n');
    const listPattern = /^(\d+[\.\)]\s*|\-\s*|\*\s*)/;
    const isList = lines.some(line => listPattern.test(line.trim()));
    
    if (isList) {
      return (
        <ul className="list-disc pl-5 space-y-2">
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Remove bullet points or numbers if they exist
            const content = trimmedLine.replace(listPattern, '');
            
            return content ? (
              <li key={index} className="text-gray-700">
                {content}
              </li>
            ) : null;
          })}
        </ul>
      );
    }
    
    // If not detected as list, return as regular text
    return (
      <p className="text-gray-700 whitespace-pre-line">
        {rulesText}
      </p>
    );
  };

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-semibold">Regras do local</h2>
        </div>
        
        <ScrollArea className="max-h-80 pr-4">
          {formatRules(rules)}
        </ScrollArea>
      </div>
    </>
  );
};
