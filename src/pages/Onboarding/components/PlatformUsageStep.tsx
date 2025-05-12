
import { Calendar, Briefcase, Building } from 'lucide-react';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';

interface PlatformUsageStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onNext: () => void;
}

export function PlatformUsageStep({ form, onNext }: PlatformUsageStepProps) {
  const { is_contratante, is_prestador, divulga_locais } = form.watch();
  
  const handleToggleContratante = () => {
    form.setValue('is_contratante', !form.getValues('is_contratante'));
    if (!form.getValues('is_contratante')) {
      form.setValue('divulga_eventos', false);
    }
  };
  
  const handleTogglePrestador = () => {
    form.setValue('is_prestador', !form.getValues('is_prestador'));
    if (!form.getValues('is_prestador')) {
      form.setValue('candidata_eventos', false);
      form.setValue('divulga_servicos', false);
    }
  };
  
  const handleToggleAnunciante = () => {
    form.setValue('divulga_locais', !form.getValues('divulga_locais'));
  };
  
  const canContinue = is_contratante || is_prestador || divulga_locais;
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-3">Como você deseja usar a plataforma hoje?</h2>
        <p className="text-muted-foreground">Você pode escolher mais de uma opção</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <OnboardingCard
          title="Divulgar eventos e contratar prestadores"
          description="Crie eventos e encontre profissionais qualificados para seus eventos"
          icon={Calendar}
          selected={is_contratante}
          onClick={handleToggleContratante}
        />
        
        <OnboardingCard
          title="Oferecer meus serviços em eventos"
          description="Seja encontrado por pessoas que buscam seus serviços para eventos"
          icon={Briefcase}
          selected={is_prestador}
          onClick={handleTogglePrestador}
        />
        
        <OnboardingCard
          title="Anunciar locais de eventos"
          description="Divulgue seus espaços para pessoas que procuram onde realizar eventos"
          icon={Building}
          selected={divulga_locais}
          onClick={handleToggleAnunciante}
        />
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={onNext}
          disabled={!canContinue}
          size="lg"
          className="px-8"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
