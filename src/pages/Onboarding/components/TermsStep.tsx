
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFunctionsData } from '../types';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TermsStepProps {
  form: UseFormReturn<OnboardingFunctionsData>;
  loading: boolean;
}

export const TermsStep = ({ form, loading }: TermsStepProps) => {
  const acceptTerms = form.watch('accept_terms');
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setScrolledToBottom(true);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-medium">Termos e Condições</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Antes de continuar, revise nossos termos de serviço
        </p>
      </div>
      
      <div 
        className="bg-muted p-4 rounded-md h-64 overflow-y-auto text-sm border border-muted" 
        onScroll={handleScroll}
      >
        <h4 className="font-medium mb-2">TERMOS DE SERVIÇO</h4>
        <p>Ao utilizar nossa plataforma, você concorda com os seguintes termos:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Todas as informações fornecidas são de sua responsabilidade e devem ser verdadeiras.</li>
          <li>Os pagamentos realizados através da plataforma estão sujeitos às políticas do provedor de pagamento.</li>
          <li>As comunicações entre prestadores e contratantes devem seguir nosso código de conduta.</li>
          <li>Reservamos o direito de remover conteúdo inadequado ou que viole nossos termos.</li>
          <li>Suas informações serão utilizadas conforme nossa política de privacidade.</li>
          <li>Você concorda em receber notificações relacionadas aos serviços contratados.</li>
          <li>A Evento+ não se responsabiliza por quaisquer informações incorretas fornecidas pelos usuários.</li>
          <li>Os usuários são responsáveis por manter suas credenciais de acesso seguras.</li>
          <li>A plataforma pode realizar atualizações periódicas em seus serviços e políticas.</li>
          <li>Ao criar eventos, os usuários concordam em seguir todas as leis e regulamentos aplicáveis.</li>
          <li>A plataforma serve apenas como intermediária entre prestadores de serviços e contratantes.</li>
          <li>Não nos responsabilizamos por disputas entre usuários da plataforma.</li>
        </ul>
      </div>
      
      {scrolledToBottom && (
        <div className="mt-3 flex items-center text-xs text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" /> Você leu os termos até o final
        </div>
      )}
      
      <Alert className="bg-blue-50 border-blue-200 mt-4">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm text-blue-700">
          Ao aceitar estes termos, você também concorda com nossa Política de Privacidade, 
          que explica como coletamos e utilizamos seus dados.
        </AlertDescription>
      </Alert>
      
      <TooltipProvider>
        <FormField
          control={form.control}
          name="accept_terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      required
                      disabled={!scrolledToBottom}
                      className={scrolledToBottom ? "data-[state=checked]:bg-primary" : "opacity-50"}
                    />
                  </TooltipTrigger>
                  {!scrolledToBottom && (
                    <TooltipContent side="right">
                      <p>Role até o final para aceitar os termos</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className={!scrolledToBottom ? "opacity-50" : ""}>
                  Li e concordo com os termos de serviço
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </TooltipProvider>
      
      <Button 
        type="submit" 
        className="w-full mt-6 bg-primary hover:bg-primary/90"
        disabled={loading || !acceptTerms || !scrolledToBottom}
      >
        {loading ? "Processando..." : "Finalizar Cadastro"}
      </Button>
    </>
  );
};
