
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';
import { Smartphone } from 'lucide-react';

interface WhatsAppStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export const WhatsAppStep = ({ form, onSubmit, onBack, loading }: WhatsAppStepProps) => {
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
                {...field}
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
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
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
        >
          Continuar
        </Button>
      </div>
    </>
  );
};
