
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OnboardingCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onClick: () => void;
}

export function OnboardingCard({ title, description, icon: Icon, selected, onClick }: OnboardingCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card
      className={cn(
        'border-2 cursor-pointer transition-all hover:shadow-md h-full',
        selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
      onClick={onClick}
    >
      <CardContent className={cn(
        "flex flex-col h-full",
        isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex flex-col sm:flex-row items-start gap-4 h-full">
          <div className={cn(
            'p-3 rounded-md mb-2 sm:mb-0 flex-shrink-0',
            selected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium mb-2 line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          </div>
          {selected && (
            <div className="sm:self-start bg-primary text-white rounded-full p-1 mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
