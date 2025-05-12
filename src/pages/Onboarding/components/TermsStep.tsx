
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '../types';
import { AlertCircle } from 'lucide-react';

interface TermsStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  loading: boolean;
}

export const TermsStep = ({ form, loading }: TermsStepProps) => {
  const acceptTerms = form.watch('accept_terms');

  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium">Termos e Condições</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Antes de continuar, revise nossos termos de serviço
        </p>
      </div>
      
      <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto text-sm">
        <h4 className="font-medium mb-2">TERMOS DE SERVIÇO</h4>
        <p>Ao utilizar nossa plataforma, você concorda com os seguintes termos:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Todas as informações fornecidas são de sua responsabilidade e devem ser verdadeiras.</li>
          <li>Os pagamentos realizados através da plataforma estão sujeitos às políticas do provedor de pagamento.</li>
          <li>As comunicações entre prestadores e contratantes devem seguir nosso código de conduta.</li>
          <li>Reservamos o direito de remover conteúdo inadequado ou que viole nossos termos.</li>
          <li>Suas informações serão utilizadas conforme nossa política de privacidade.</li>
          <li>Você concorda em receber notificações relacionadas aos serviços contratados.</li>
        </ul>
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
                Li e concordo com os termos de serviço
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      
      <Button 
        type="submit" 
        className="w-full mt-6"
        disabled={loading || !acceptTerms}
      >
        {loading ? "Processando..." : "Finalizar Cadastro"}
      </Button>
    </>
  );
};
