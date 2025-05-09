
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import DocsLayout from '@/components/docs/DocsLayout';

const GettingStarted = () => {
  return (
    <DocsLayout title="Guia de Início">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Guia de Início Rápido</h1>
          <p className="text-muted-foreground">
            Este guia irá ajudá-lo a começar a usar nossa plataforma rapidamente e com eficiência.
            Siga as etapas abaixo para configurar sua conta e começar a criar eventos.
          </p>
        </div>

        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</div>
              Criando sua conta
            </CardTitle>
            <CardDescription>
              O primeiro passo é criar sua conta na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Para começar, você precisa criar uma conta usando seu e-mail ou conta do Google.
              Durante o registro, você escolherá seu tipo de perfil:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Contratante:</strong> Se você deseja organizar eventos e contratar serviços</li>
              <li><strong>Prestador de Serviços:</strong> Se você oferece serviços para eventos</li>
              <li><strong>Anunciante de Locais:</strong> Se você possui locais para aluguel de eventos</li>
            </ul>

            <Button asChild>
              <Link to="/login">
                Criar minha conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</div>
              Completando seu perfil
            </CardTitle>
            <CardDescription>
              Preencha as informações do seu perfil para melhorar suas chances de sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Depois de criar sua conta, é importante completar seu perfil com todas as informações relevantes:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Adicione uma foto de perfil profissional</li>
              <li>Preencha seus dados de contato completos</li>
              <li>Descreva sua experiência e especialidades</li>
              <li>Adicione suas redes sociais e website (se tiver)</li>
            </ul>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Perfis completos têm 3x mais chances de serem escolhidos por contratantes!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</div>
              Escolhendo seu plano
            </CardTitle>
            <CardDescription>
              Selecione o plano que melhor atende às suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Oferecemos diferentes planos para atender às suas necessidades:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Plano Gratuito:</strong> Ideal para começar e conhecer a plataforma</li>
              <li><strong>Plano Premium:</strong> Recursos avançados para usuários frequentes</li>
              <li><strong>Plano Enterprise:</strong> Solução completa para empresas e profissionais de alto volume</li>
            </ul>

            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Você pode começar com o plano gratuito e fazer upgrade quando precisar!
              </AlertDescription>
            </Alert>

            <Button asChild variant="outline">
              <Link to="/plans">
                Ver planos disponíveis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Success message */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium text-green-800">Pronto para começar!</h3>
                <p className="text-green-700 mt-1">
                  Agora você está pronto para começar a usar nossa plataforma. Se precisar de ajuda adicional, 
                  consulte nossa documentação completa ou entre em contato com nosso suporte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/docs">
              Voltar para Documentação
            </Link>
          </Button>
          <Button asChild>
            <Link to="/docs/creating-events">
              Próximo: Criando Eventos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </DocsLayout>
  );
};

export default GettingStarted;
