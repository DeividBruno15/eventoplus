
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';
import { Smartphone } from 'lucide-react';
import { useState } from 'react';

interface WhatsAppStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export const WhatsAppStep = ({ form, onSubmit, onBack, loading }: WhatsAppStepProps) => {
  const [formattedPhone, setFormattedPhone] = useState(form.getValues('phone_number') || '');
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      // Formata o número enquanto digita
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 9) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }
      
      setFormattedPhone(value);
      form.setValue('phone_number', value);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Smartphone className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-medium">WhatsApp</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione seu WhatsApp para receber notificações importantes
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de telefone</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="(00) 00000-0000"
                value={formattedPhone}
                onChange={handlePhoneChange}
                className="focus:border-green-500 focus:ring-green-500"
              />
            </FormControl>
            <FormDescription>
              Este número será usado para comunicações sobre suas atividades na plataforma
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="accept_whatsapp"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer">
                Quero receber notificações por WhatsApp
              </FormLabel>
              <FormDescription>
                Você receberá atualizações importantes, novas oportunidades e alertas relevantes
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button"
          onClick={onBack}
          variant="outline"
          size="lg"
        >
          Voltar
        </Button>
        <Button 
          type="button"
          onClick={onSubmit}
          disabled={loading}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continuar
        </Button>
      </div>
    </>
  );
};
