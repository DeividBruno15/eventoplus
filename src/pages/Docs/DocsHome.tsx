
import { DocsLayout } from "@/components/docs/DocsLayout";
import { DocumentationCard } from "@/components/docs/DocumentationCard";
import { Calendar, MapPin, User, MessageSquare, HelpCircle, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DocsHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const documentationCategories = [
    {
      title: "Criação de Eventos",
      description: "Aprenda a criar e gerenciar seus eventos",
      icon: <Calendar className="h-5 w-5 text-primary" />,
      path: "/docs/creating-events",
      tags: ["eventos", "criar", "gerenciar", "organizador", "contratante"]
    },
    {
      title: "Locais e Espaços",
      description: "Encontre ou anuncie locais para eventos",
      icon: <MapPin className="h-5 w-5 text-primary" />,
      path: "/docs/venues",
      tags: ["locais", "espaços", "anunciar", "encontrar"]
    },
    {
      title: "Prestadores de Serviço",
      description: "Guia para prestadores e contratantes",
      icon: <User className="h-5 w-5 text-primary" />,
      path: "/docs/providers",
      tags: ["prestadores", "serviços", "contratar", "ofertas"]
    },
    {
      title: "Chat e Comunicação",
      description: "Comunique-se com prestadores e clientes",
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      path: "/docs/chat",
      tags: ["chat", "mensagens", "comunicação"]
    },
    {
      title: "Configurações e Perfil",
      description: "Configure sua conta e perfil",
      icon: <Settings className="h-5 w-5 text-primary" />,
      path: "/docs/settings",
      tags: ["configurações", "perfil", "conta", "ajustes"]
    },
    {
      title: "FAQ e Suporte",
      description: "Perguntas frequentes e ajuda",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      path: "/docs/faq",
      tags: ["faq", "ajuda", "suporte", "dúvidas"]
    }
  ];

  const filteredDocumentation = searchQuery 
    ? documentationCategories.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
      )
    : documentationCategories;

  return (
    <DocsLayout title="Documentação - Evento+">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documentação Evento+</h1>
          <p className="text-muted-foreground">
            Bem-vindo à documentação oficial do Evento+. Aqui você encontrará tudo que precisa saber para usar nossa plataforma.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar na documentação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setSearchQuery("")}
            >
              Limpar
            </Button>
          )}
        </div>

        <Tabs defaultValue="geral" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="contratantes">Contratantes</TabsTrigger>
            <TabsTrigger value="prestadores">Prestadores</TabsTrigger>
            <TabsTrigger value="anunciantes">Anunciantes</TabsTrigger>
          </TabsList>
          <TabsContent value="geral">
            <p className="mb-4 text-muted-foreground">Documentação geral para todos os usuários da plataforma.</p>
          </TabsContent>
          <TabsContent value="contratantes">
            <p className="mb-4 text-muted-foreground">Recursos específicos para contratantes e organizadores de eventos.</p>
          </TabsContent>
          <TabsContent value="prestadores">
            <p className="mb-4 text-muted-foreground">Informações para prestadores de serviço da plataforma.</p>
          </TabsContent>
          <TabsContent value="anunciantes">
            <p className="mb-4 text-muted-foreground">Guia para anunciantes de espaços e locais para eventos.</p>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {filteredDocumentation.map((doc) => (
            <DocumentationCard
              key={doc.path}
              title={doc.title}
              description={doc.description}
              icon={doc.icon}
              path={doc.path}
            />
          ))}
        </div>

        <div className="bg-secondary/30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Precisa de mais ajuda?</h2>
          <p className="mb-4">
            Se não encontrar o que procura na documentação, nossa equipe de suporte está sempre pronta para ajudar.
          </p>
          <Button onClick={() => window.location.href = "/support"}>
            Entrar em contato
          </Button>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsHome;
