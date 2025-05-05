
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../types';

interface TermsStepProps {
  form: UseFormReturn<OnboardingFormData>;
  loading: boolean;
}

export const TermsStep = ({ form, loading }: TermsStepProps) => {
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
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="accept_terms"
          className="rounded border-gray-300"
          {...form.register('accept_terms')}
        />
        <Label htmlFor="accept_terms">
          Li e concordo com os termos de serviço
        </Label>
      </div>
      <FormMessage>{form.formState.errors.accept_terms?.message}</FormMessage>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading || !form.watch('accept_terms')}
      >
        {loading ? "Processando..." : "Finalizar Cadastro"}
      </Button>
    </>
  );
};
