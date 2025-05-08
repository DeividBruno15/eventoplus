
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface VenueDescriptionProps {
  description: string;
  externalLink?: string | null;
}

export const VenueDescription = ({
  description,
  externalLink
}: VenueDescriptionProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Descrição</h2>
      
      <Card className="p-6">
        <div className="prose max-w-none">
          {description.split('\n').map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
        
        {externalLink && (
          <div className="mt-6">
            <a 
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visitar site oficial</span>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};
