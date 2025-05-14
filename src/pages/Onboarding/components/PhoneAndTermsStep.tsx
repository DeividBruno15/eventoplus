
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '../types';
import { WhatsAppStep } from '@/components/onboarding/WhatsAppStep';
import { TermsStep } from '@/components/onboarding/TermsStep';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PhoneAndTermsStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export function PhoneAndTermsStep({ form, onSubmit, onBack, loading }: PhoneAndTermsStepProps) {
  const [activeTab, setActiveTab] = useState<'phone' | 'terms'>('phone');
  
  const handleNext = () => {
    // Validar campo de telefone antes de avançar
    const phoneNumber = form.getValues('phone_number');
    if (!phoneNumber || phoneNumber.length < 14) {
      form.setError('phone_number', { 
        type: 'manual', 
        message: 'Por favor, insira um número de telefone válido' 
      });
      return;
    }
    setActiveTab('terms');
  };
  
  const handleBack = () => {
    if (activeTab === 'terms') {
      setActiveTab('phone');
    } else {
      onBack();
    }
  };

  const progressValue = activeTab === 'phone' ? 50 : 100;

  return (
    <div className="space-y-6">
      <Progress value={progressValue} className="h-2 mb-6" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'phone' && (
            <div className="space-y-6 animate-fade-in">
              <WhatsAppStep 
                form={form} 
                onSubmit={handleNext} 
                onBack={handleBack} 
                loading={false} 
              />
            </div>
          )}
          
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center mb-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="text-muted-foreground flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar para WhatsApp
                </Button>
              </div>
              
              <TermsStep 
                form={form} 
                loading={loading} 
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
