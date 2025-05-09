
import React, { useEffect } from 'react';
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
  
  // Effect to ensure navigation elements remain visible
  useEffect(() => {
    // This ensures sidebar and topbar remain visible when accessing this page
    // by making sure no overflow or hidden properties are applied
    const sidebar = document.querySelector('[data-sidebar="sidebar"]');
    if (sidebar) {
      sidebar.removeAttribute('style');
    }
    
    return () => {
      // Cleanup function to restore normal behavior when leaving the page
    };
  }, []);

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
            <CardContent className="pt-6">
              <p>Conteúdo sobre eventos estará disponível em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardContent className="pt-6">
              <p>Conteúdo sobre pagamentos estará disponível em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardContent className="pt-6">
              <p>Conteúdo sobre contas estará disponível em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
