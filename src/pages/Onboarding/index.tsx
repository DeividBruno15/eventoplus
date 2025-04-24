
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem, Form, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const onboardingSchema = z.object({
  phone_number: z.string().min(10, 'Telefone inválido'),
  accept_whatsapp: z.boolean().default(true),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos de serviço',
  }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const Onboarding = () => {
  const { user, updateOnboardingStatus, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phone_number: '',
      accept_whatsapp: true,
      accept_terms: false,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  const onSubmit = async (data: OnboardingFormData) => {
    if (step === 1) {
      try {
        // Atualiza o número de telefone no perfil do usuário
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            phone_number: data.phone_number 
          })
          .eq('id', user?.id);
          
        if (error) throw error;
        
        // Avança para o próximo passo
        setStep(2);
      } catch (error: any) {
        console.error('Erro ao atualizar telefone:', error);
        toast({
          title: "Erro ao atualizar dados",
          description: error.message || 'Ocorreu um erro ao atualizar seus dados',
          variant: "destructive",
        });
      }
    } else if (step === 2) {
      // Finaliza o onboarding
      await updateOnboardingStatus(true);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div className={`rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
            {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <div className={`h-1 w-12 ${step > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
            "2"
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo(a)! Vamos finalizar seu cadastro</CardTitle>
            <CardDescription>
              Apenas mais alguns passos para você começar a usar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepIndicator()}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
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
                )}
                
                {step === 2 && (
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
                      {/* Adicione mais termos conforme necessário */}
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
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
