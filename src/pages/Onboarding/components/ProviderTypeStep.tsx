
import { UserSearch, Megaphone, Building } from 'lucide-react';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';

interface ProviderTypeStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onNext: () => void;
  onBack: () => void;
}

export function ProviderTypeStep({ form, onNext, onBack }: ProviderTypeStepProps) {
  const { candidata_eventos, divulga_servicos, divulga_locais } = form.watch();
  
  const handleToggleCandidatar = () => {
    form.setValue('candidata_eventos', !form.getValues('candidata_eventos'));
  };
  
  const handleToggleDivulgar = () => {
    form.setValue('divulga_servicos', !form.getValues('divulga_servicos'));
  };
  
  const handleToggleLocais = () => {
    form.setValue('divulga_locais', !form.getValues('divulga_locais'));
  };
  
  const canContinue = candidata_eventos || divulga_servicos || divulga_locais;
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-3">Como você quer atuar como prestador?</h2>
        <p className="text-muted-foreground">Você pode escolher mais de uma opção</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <OnboardingCard
          title="Me candidatar a eventos existentes"
          description="Busque e se candidate a eventos publicados na plataforma"
          icon={UserSearch}
          selected={candidata_eventos}
          onClick={handleToggleCandidatar}
        />
        
        <OnboardingCard
          title="Divulgar meus serviços"
          description="Crie um perfil destacando seus serviços para ser encontrado"
          icon={Megaphone}
          selected={divulga_servicos}
          onClick={handleToggleDivulgar}
        />
        
        <OnboardingCard
          title="Anunciar locais de eventos"
          description="Divulgue espaços para eventos que você possui ou representa"
          icon={Building}
          selected={divulga_locais}
          onClick={handleToggleLocais}
        />
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-6"
        >
          Voltar
        </Button>
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
