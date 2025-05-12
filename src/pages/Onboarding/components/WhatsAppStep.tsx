
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '../types';

interface WhatsAppStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
}

export const WhatsAppStep = ({ form }: WhatsAppStepProps) => {
  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium">WhatsApp</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione seu WhatsApp para receber notificações importantes
        </p>
      </div>
      
      <FormItem>
        <FormLabel>Número de WhatsApp</FormLabel>
        <FormControl>
          <Input
            type="tel"
            placeholder="(00) 00000-0000"
            {...form.register('phone_number')}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="accept_whatsapp"
          className="rounded border-gray-300"
          {...form.register('accept_whatsapp')}
        />
        <Label htmlFor="accept_whatsapp">
          Concordo em receber notificações via WhatsApp
        </Label>
      </div>
      
      <Button type="submit" className="w-full">
        Continuar <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
};
