
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '../types';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Calendar, Briefcase, Building, UserSearch, Megaphone } from 'lucide-react';

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
    divulga_locais 
  } = form.watch();
  
  const isMobile = useIsMobile();
  
  const getSelectionCount = () => {
    let count = 0;
    if (is_contratante) count++;
    if (is_prestador) count++;
    if (divulga_locais && !is_prestador) count++; // Só contar se não for prestador
    return count;
  };
  
  const hasFunctionsSelected = () => {
    if (is_prestador) {
      return candidata_eventos || divulga_servicos || divulga_locais;
    }
    return true;
  };
  
  const renderSelectedRole = (role: string, icon: React.ReactNode, subtitle: string) => (
    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-md">
      <div className="bg-primary text-white p-2 rounded-md shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{role}</h4>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
  
  const renderProviderFunctions = () => {
    if (!is_prestador) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h3 className="text-md font-medium">Você vai atuar como prestador:</h3>
        <div className="space-y-2">
          {candidata_eventos && (
            <div className="flex items-center gap-2 text-sm">
              <UserSearch className="h-4 w-4 text-primary" />
              <span>Candidatar-se a eventos existentes</span>
            </div>
          )}
          
          {divulga_servicos && (
            <div className="flex items-center gap-2 text-sm">
              <Megaphone className="h-4 w-4 text-primary" />
              <span>Divulgar meus serviços</span>
            </div>
          )}
          
          {divulga_locais && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-primary" />
              <span>Anunciar locais para eventos</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Confirme suas escolhas</h2>
        <p className="text-muted-foreground text-sm">
          Você selecionou {getSelectionCount()} {getSelectionCount() === 1 ? 'função' : 'funções'}
        </p>
      </div>
      
      <div className="space-y-4">
        {is_contratante && renderSelectedRole(
          "Contratante", 
          <Calendar className="h-5 w-5" />, 
          "Você poderá criar eventos e contratar prestadores de serviços"
        )}
        
        {is_prestador && renderSelectedRole(
          "Prestador de serviços", 
          <Briefcase className="h-5 w-5" />, 
          "Você poderá oferecer seus serviços para eventos"
        )}
        
        {divulga_locais && !is_prestador && renderSelectedRole(
          "Anunciante de locais", 
          <Building className="h-5 w-5" />, 
          "Você poderá divulgar espaços para a realização de eventos"
        )}
        
        {renderProviderFunctions()}
      </div>
      
      <div className={cn(
        "flex justify-between mt-6",
        isMobile ? "flex-col gap-3" : ""
      )}>
        <Button 
          onClick={onBack}
          variant="outline"
          size={isMobile ? "default" : "lg"}
          className={isMobile ? "w-full" : "px-6"}
        >
          Voltar
        </Button>
        <Button 
          onClick={onNext}
          disabled={!hasFunctionsSelected()}
          size={isMobile ? "default" : "lg"}
          className={isMobile ? "w-full" : "px-8"}
        >
          Continuar para cadastro
        </Button>
      </div>
    </div>
  );
}
