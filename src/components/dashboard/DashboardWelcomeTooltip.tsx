
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface WelcomeTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  isFirstVisit: boolean;
}

export function DashboardWelcomeTooltip({ 
  children, 
  title, 
  description, 
  isFirstVisit 
}: WelcomeTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isFirstVisit && !dismissed) {
      // Pequeno delay para mostrar o tooltip após o carregamento
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, dismissed]);

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
  };

  if (!isFirstVisit || dismissed) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="p-4 max-w-xs z-50 shadow-lg"
          sideOffset={5}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium">{title}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={handleDismiss}
            >
              Entendi
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
