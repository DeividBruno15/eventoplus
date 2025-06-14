
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';
import { ChevronLeft, Camera, Music, Utensils, PartyPopper, Palette, Sparkles, Users, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ServicesSelectionStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onComplete: () => void;
  onBack: () => void;
}

const services = [
  { id: 'fotografia', name: 'Fotografia', icon: Camera },
  { id: 'musica', name: 'Música', icon: Music },
  { id: 'buffet', name: 'Buffet', icon: Utensils },
  { id: 'decoracao', name: 'Decoração', icon: PartyPopper },
  { id: 'design', name: 'Design', icon: Palette },
  { id: 'entretenimento', name: 'Entretenimento', icon: Sparkles },
  { id: 'staff', name: 'Staff', icon: Users },
  { id: 'iluminacao', name: 'Iluminação', icon: Lightbulb },
];

export function ServicesSelectionStep({ form, onComplete, onBack }: ServicesSelectionStepProps) {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const canContinue = selectedServices.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Quais serviços você oferece?</h3>
        <p className="text-muted-foreground">Selecione os serviços que você pode prestar</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const Icon = service.icon;
          
          return (
            <Card
              key={service.id}
              className={cn(
                'cursor-pointer transition-all border-2 hover:shadow-md',
                isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              )}
              onClick={() => handleServiceToggle(service.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={cn(
                  'inline-flex p-3 rounded-lg mb-2',
                  isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-medium">{service.name}</h4>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          size="lg"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button 
          onClick={onComplete}
          disabled={!canContinue}
          size="lg"
        >
          Finalizar
        </Button>
      </div>
    </div>
  );
}
