
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const HelpCenter = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint("md");

  return (
    <div className="space-y-6 animate-fade-in pt-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Central de Ajuda</h2>
          <p className="text-muted-foreground mt-2">
            Encontre respostas para suas dúvidas mais frequentes
          </p>
        </div>
        
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-9 w-9"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Pesquise por ajuda..."
          className="pl-10 bg-white"
        />
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="billing">Pagamentos</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="general">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-medium">Perguntas Frequentes</h3>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1">
                  <AccordionTrigger>Como funciona a plataforma?</AccordionTrigger>
                  <AccordionContent>
                    Nossa plataforma conecta organizadores de eventos com prestadores de serviços. 
                    Organize seu evento e encontre os melhores profissionais em um só lugar.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Como criar um evento?</AccordionTrigger>
                  <AccordionContent>
                    Para criar um evento, acesse a seção "Eventos" no menu lateral e clique no botão "Criar Evento".
                    Preencha todas as informações necessárias e seu evento estará pronto para receber propostas.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Quanto custa usar a plataforma?</AccordionTrigger>
                  <AccordionContent>
                    Oferecemos planos gratuitos e pagos. O plano gratuito permite criar até 3 eventos por mês.
                    Para mais recursos e eventos ilimitados, confira nossos planos premium.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>Como posso me tornar um prestador de serviços?</AccordionTrigger>
                  <AccordionContent>
                    Ao se cadastrar, escolha a opção "Prestador de Serviços". Você poderá então
                    configurar seu perfil, adicionar serviços e começar a receber solicitações.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-medium">Perguntas sobre Eventos</h3>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="e1">
                  <AccordionTrigger>Como criar um novo evento?</AccordionTrigger>
                  <AccordionContent>
                    Para criar um evento, navegue até a seção "Eventos" e clique no botão "Criar Evento". 
                    Siga o formulário preenchendo todas as informações necessárias como data, local, e serviços necessários.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="e2">
                  <AccordionTrigger>Como convidar prestadores para meu evento?</AccordionTrigger>
                  <AccordionContent>
                    Após criar seu evento, ele ficará visível para prestadores de serviços compatíveis, que poderão
                    enviar propostas. Você também pode buscar prestadores específicos e convidá-los diretamente.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="e3">
                  <AccordionTrigger>Posso editar um evento depois de criado?</AccordionTrigger>
                  <AccordionContent>
                    Sim, você pode editar detalhes do seu evento a qualquer momento, desde que ainda não tenha 
                    confirmado prestadores de serviço. Para editar, acesse o evento e clique no botão "Editar".
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-medium">Perguntas sobre Pagamentos</h3>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="b1">
                  <AccordionTrigger>Quais métodos de pagamento são aceitos?</AccordionTrigger>
                  <AccordionContent>
                    Aceitamos cartões de crédito e débito das principais bandeiras, além de Pix 
                    e boleto bancário para assinaturas e serviços.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="b2">
                  <AccordionTrigger>Como solicitar reembolso?</AccordionTrigger>
                  <AccordionContent>
                    Reembolsos podem ser solicitados em até 7 dias após o pagamento, desde que não tenha 
                    utilizado os serviços. Acesse "Pagamentos" e selecione a opção "Solicitar Reembolso".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="b3">
                  <AccordionTrigger>Como alterar meu plano?</AccordionTrigger>
                  <AccordionContent>
                    Para alterar seu plano, acesse "Assinatura" no menu lateral e selecione 
                    "Gerenciar Plano". Lá você poderá fazer upgrade ou downgrade do seu plano atual.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-medium">Perguntas sobre Conta</h3>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a1">
                  <AccordionTrigger>Como alterar minha senha?</AccordionTrigger>
                  <AccordionContent>
                    Para alterar sua senha, acesse "Perfil" no menu lateral, depois clique na aba 
                    "Segurança" e selecione a opção "Alterar Senha".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="a2">
                  <AccordionTrigger>Como adicionar ou alterar métodos de contato?</AccordionTrigger>
                  <AccordionContent>
                    Acesse "Perfil" no menu lateral e clique em "Editar Perfil". 
                    Lá você poderá adicionar ou alterar e-mail, telefone e outros dados de contato.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="a3">
                  <AccordionTrigger>Como excluir minha conta?</AccordionTrigger>
                  <AccordionContent>
                    Para excluir sua conta, acesse "Configurações" no menu lateral, 
                    depois selecione "Conta" e clique em "Excluir Conta". Confirme sua decisão.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
