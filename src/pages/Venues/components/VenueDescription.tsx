
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface VenueDescriptionProps {
  description: string;
  externalLink?: string | null;
}

export const VenueDescription = ({ description, externalLink }: VenueDescriptionProps) => {
  // Função para detectar links no texto e torná-los clicáveis
  const formatDescription = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-words"
          >
            {part}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Descrição</h2>
      <div className="text-gray-700 whitespace-pre-line">
        {formatDescription(description)}
      </div>
      
      {externalLink && (
        <div className="mt-4">
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 gap-1 group"
          >
            <span>Visite o site oficial</span>
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      )}
    </div>
  );
};
