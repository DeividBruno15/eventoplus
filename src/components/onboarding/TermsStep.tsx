
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '@/pages/Onboarding/types';
import { AlertCircle } from 'lucide-react';

interface TermsStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  onNext?: () => void;
  onBack?: () => void;
  loading?: boolean;
}

export function TermsStep({ form, onNext, onBack, loading }: TermsStepProps) {
  const acceptTerms = form.watch('accept_terms');

  const handleNext = () => {
    if (onNext) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Termos de uso</h2>
        <p className="text-muted-foreground">Por favor, leia e aceite nossos termos de serviço</p>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 max-h-64 overflow-y-auto mb-4">
        <h3 className="font-semibold mb-2">Termos de Serviço</h3>
        <p className="mb-4">Ao utilizar nossa plataforma, você concorda com os seguintes termos:</p>
        
        <ol className="list-decimal pl-5 space-y-2">
          <li>Você é responsável pelas informações fornecidas em seu perfil e anúncios.</li>
          <li>Não é permitido criar contas falsas ou utilizar informações inverídicas.</li>
          <li>Você concorda em não utilizar a plataforma para atividades ilegais.</li>
          <li>Reservamo-nos o direito de remover qualquer conteúdo que viole nossos termos.</li>
          <li>Ao se cadastrar, você concorda em receber comunicações relacionadas ao serviço.</li>
          <li>Você pode cancelar sua conta a qualquer momento.</li>
          <li>Os dados fornecidos são protegidos de acordo com nossa política de privacidade.</li>
          <li>A plataforma não se responsabiliza por acordos fechados entre usuários.</li>
        </ol>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Ao aceitar estes termos, você também concorda com nossa Política de Privacidade, que explica como coletamos e utilizamos seus dados.
            </p>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="accept_terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    required
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Eu li e aceito os Termos de Serviço e a Política de Privacidade
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex justify-between mt-8">
            {onBack && (
              <Button 
                type="button"
                onClick={onBack}
                variant="outline"
                size="lg"
              >
                Voltar
              </Button>
            )}
            {onNext && (
              <Button 
                type="button"
                disabled={!acceptTerms || loading}
                onClick={handleNext}
                size="lg"
              >
                {loading ? "Processando..." : "Continuar"}
              </Button>
            )}
            {!onNext && (
              <Button 
                type="submit"
                disabled={!acceptTerms || loading}
                size="lg"
                className="ml-auto"
              >
                {loading ? "Processando..." : "Finalizar cadastro"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
