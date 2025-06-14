
import React from 'react';
import { Calendar, Briefcase, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UserTypeSelectionStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onNext: () => void;
}

export function UserTypeSelectionStep({ form, onNext }: UserTypeSelectionStepProps) {
  const { is_contratante, is_prestador, divulga_locais } = form.watch();
  
  const handleSelectContratante = () => {
    form.setValue('is_contratante', true);
    form.setValue('is_prestador', false);
    form.setValue('divulga_locais', false);
    // Reset related fields
    form.setValue('candidata_eventos', false);
    form.setValue('divulga_servicos', false);
  };
  
  const handleSelectPrestador = () => {
    form.setValue('is_contratante', false);
    form.setValue('is_prestador', true);
    form.setValue('divulga_locais', false);
    // Reset related fields
    form.setValue('divulga_eventos', false);
  };
  
  const handleSelectAnunciante = () => {
    form.setValue('is_contratante', false);
    form.setValue('is_prestador', false);
    form.setValue('divulga_locais', true);
    // Reset related fields
    form.setValue('candidata_eventos', false);
    form.setValue('divulga_servicos', false);
    form.setValue('divulga_eventos', false);
  };
  
  const selectedOption = is_contratante ? 'contratante' : is_prestador ? 'prestador' : divulga_locais ? 'anunciante' : null;
  const canContinue = selectedOption !== null;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Como você deseja usar a plataforma?</h3>
        <p className="text-muted-foreground">Escolha uma opção para continuar</p>
      </div>
      
      <div className="grid gap-4">
        <Card
          className={cn(
            'cursor-pointer transition-all border-2 hover:shadow-md',
            selectedOption === 'contratante' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
          onClick={handleSelectContratante}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-lg',
                selectedOption === 'contratante' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium mb-2">Divulgar eventos e contratar prestadores</h4>
                <p className="text-sm text-muted-foreground">
                  Crie eventos e encontre profissionais qualificados para seus eventos
                </p>
              </div>
              {selectedOption === 'contratante' && (
                <div className="bg-primary text-white rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card
          className={cn(
            'cursor-pointer transition-all border-2 hover:shadow-md',
            selectedOption === 'prestador' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
          )}
          onClick={handleSelectPrestador}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-lg',
                selectedOption === 'prestador' ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium mb-2">Oferecer meus serviços em eventos</h4>
                <p className="text-sm text-muted-foreground">
                  Seja encontrado por pessoas que buscam seus serviços para eventos
                </p>
              </div>
              {selectedOption === 'prestador' && (
                <div className="bg-secondary text-white rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card
          className={cn(
            'cursor-pointer transition-all border-2 hover:shadow-md',
            selectedOption === 'anunciante' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
          )}
          onClick={handleSelectAnunciante}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-lg',
                selectedOption === 'anunciante' ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Building className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium mb-2">Anunciar locais de eventos</h4>
                <p className="text-sm text-muted-foreground">
                  Divulgue seus espaços para pessoas que procuram onde realizar eventos
                </p>
              </div>
              {selectedOption === 'anunciante' && (
                <div className="bg-accent text-white rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onNext}
          disabled={!canContinue}
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
