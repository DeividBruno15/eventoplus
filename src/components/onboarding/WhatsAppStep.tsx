
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form';
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

export function WhatsAppStep({ form, onSubmit, onBack, loading }: WhatsAppStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Smartphone className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Receba notificações importantes</h2>
        <p className="text-muted-foreground">
          Informe seu número para receber notificações sobre suas atividades na plataforma
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(99) 99999-9999"
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
              type="submit"
              disabled={loading}
              size="lg"
            >
              {loading ? 'Processando...' : 'Finalizar cadastro'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
