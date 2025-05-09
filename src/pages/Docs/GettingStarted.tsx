
import { DocsLayout } from "@/components/docs/DocsLayout";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

export const GettingStarted = () => {
  return (
    <DocsLayout title="Guia de Início">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Primeiros Passos no Evento+</h1>
          <p className="text-muted-foreground mb-6">
            Este guia irá ajudá-lo a começar a usar o Evento+ rapidamente e aproveitar todos os recursos da plataforma.
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">1. Crie sua conta</h2>
          <div className="space-y-4 mb-6">
            <p>
              Para começar a usar o Evento+, você precisa criar uma conta. O processo é simples:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acesse a página de cadastro</li>
              <li>Preencha seus dados pessoais</li>
              <li>Escolha o tipo de conta que você deseja criar:
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li><strong>Contratante:</strong> Para quem deseja organizar eventos</li>
                  <li><strong>Prestador:</strong> Para quem oferece serviços para eventos</li>
                  <li><strong>Anunciante:</strong> Para quem possui espaços para locação</li>
                </ul>
              </li>
              <li>Confirme seu e-mail clicando no link enviado</li>
            </ul>
          </div>

          <div className="rounded-md border p-4 mb-6">
            <h3 className="font-medium mb-2">Dica: Complete seu perfil</h3>
            <p>
              Um perfil completo aumenta suas chances de encontrar parceiros ou clientes. Certifique-se de adicionar:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Uma foto de perfil profissional</li>
              <li>Descrição detalhada de seus serviços ou necessidades</li>
              <li>Dados de contato atualizados</li>
            </ul>
          </div>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Sua conta pode receber verificação após a análise de nossos administradores, aumentando sua credibilidade na plataforma.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">2. Explore o Painel</h2>
          <p className="mb-4">
            Após fazer login, você será direcionado ao seu painel personalizado, que varia de acordo com o tipo de conta:
          </p>
          
          <div className="space-y-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Painel do Contratante</h3>
              <p>Aqui você pode:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Criar novos eventos</li>
                <li>Gerenciar eventos existentes</li>
                <li>Buscar locais para seus eventos</li>
                <li>Encontrar prestadores de serviço</li>
                <li>Visualizar orçamentos e propostas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Painel do Prestador</h3>
              <p>Aqui você pode:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Visualizar oportunidades de eventos</li>
                <li>Enviar propostas para contratantes</li>
                <li>Gerenciar seus serviços</li>
                <li>Acompanhar seu calendário de compromissos</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Painel do Anunciante</h3>
              <p>Aqui você pode:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Cadastrar seus espaços e locais</li>
                <li>Gerenciar disponibilidade</li>
                <li>Receber solicitações de reserva</li>
                <li>Acompanhar avaliações dos clientes</li>
              </ul>
            </div>
          </div>
          
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Mantenha suas informações sempre atualizadas para garantir que potenciais parceiros ou clientes possam entrar em contato facilmente.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">3. Próximos Passos</h2>
          <p className="mb-4">
            Agora que você já conhece o básico, recomendamos:
          </p>
          
          <ul className="space-y-4 mb-6">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Explore a documentação específica para seu perfil</strong>
                <p className="text-muted-foreground">
                  Temos guias detalhados para contratantes, prestadores e anunciantes.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Configure suas preferências de notificação</strong>
                <p className="text-muted-foreground">
                  Personalize como e quando deseja receber alertas sobre novas oportunidades.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Conecte suas redes sociais</strong>
                <p className="text-muted-foreground">
                  Aumente sua visibilidade integrando seus perfis profissionais à plataforma.
                </p>
              </div>
            </li>
          </ul>
          
          <Alert variant="default" className="bg-primary/10 border-primary/20">
            <Info className="h-4 w-4" />
            <AlertTitle>Suporte</AlertTitle>
            <AlertDescription>
              Caso tenha dúvidas, nossa equipe está disponível através do chat de suporte ou pelo e-mail suporte@eventoplus.com.br
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    </DocsLayout>
  );
};

export default GettingStarted;
