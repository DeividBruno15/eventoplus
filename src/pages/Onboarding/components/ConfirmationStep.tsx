
import { Check, Calendar, Briefcase, Search, Megaphone, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';
import { UseFormReturn } from 'react-hook-form';

interface ConfirmationStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmationStep({ form, onNext, onBack }: ConfirmationStepProps) {
  const { 
    is_contratante, 
    is_prestador, 
    candidata_eventos, 
    divulga_servicos, 
    divulga_locais, 
    divulga_eventos 
  } = form.watch();

  const features = [
    {
      id: 'criar_eventos',
      enabled: is_contratante,
      label: 'Criar e gerenciar eventos',
      icon: Calendar
    },
    {
      id: 'contratar_prestadores',
      enabled: is_contratante,
      label: 'Ver e contratar prestadores',
      icon: Search
    },
    {
      id: 'candidatar',
      enabled: candidata_eventos,
      label: 'Se candidatar a eventos',
      icon: Briefcase
    },
    {
      id: 'divulgar_servicos',
      enabled: divulga_servicos,
      label: 'Divulgar seus serviços',
      icon: Megaphone
    },
    {
      id: 'divulgar_locais',
      enabled: divulga_locais,
      label: 'Anunciar locais de evento',
      icon: Building
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Tudo certo!</h2>
        <p className="text-muted-foreground">Aqui está o que você poderá fazer na plataforma:</p>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
        {features.filter(f => f.enabled).map(feature => (
          <div key={feature.id} className="flex items-center space-x-3">
            <div className="bg-primary/10 text-primary rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
            <div className="flex items-center space-x-2">
              <feature.icon className="h-5 w-5 text-muted-foreground" />
              <span>{feature.label}</span>
            </div>
          </div>
        ))}
        
        <div className="flex items-start space-x-3 pt-3 border-t border-border mt-3">
          <div className="bg-amber-100 text-amber-600 rounded-full p-1">
            <ArrowRight className="h-5 w-5" />
          </div>
          <span className="text-sm">Você pode mudar isso a qualquer momento no seu perfil</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          onClick={onBack}
          variant="outline"
          size="lg"
        >
          Voltar
        </Button>
        <Button 
          onClick={onNext}
          size="lg"
        >
          Completar cadastro
        </Button>
      </div>
    </div>
  );
}
