
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Search, 
  FileText, 
  BookOpen, 
  VideoIcon,
  ChevronRight,
  MessageCircle,
  Calendar as CalendarIcon
} from "lucide-react";

const HelpCenter = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!session) {
    navigate('/login');
    return null;
  }

  const popularArticles = [
    { id: 1, title: "Como criar o seu primeiro evento", icon: FileText },
    { id: 2, title: "Gerenciando seus contatos e conversas", icon: MessageCircle },
    { id: 3, title: "Configurando seu perfil profissional", icon: FileText },
    { id: 4, title: "Assinatura e planos: como funciona", icon: FileText },
    { id: 5, title: "Recebendo pagamentos pela plataforma", icon: FileText },
    { id: 6, title: "Políticas de privacidade e segurança", icon: FileText }
  ];

  const categories = [
    { id: 1, title: "Primeiros passos", description: "Aprenda a configurar sua conta e entender as funcionalidades básicas", icon: BookOpen },
    { id: 2, title: "Eventos", description: "Como criar, gerenciar e promover seus eventos", icon: CalendarIcon },
    { id: 3, title: "Mensagens", description: "Tudo sobre o sistema de chat e comunicação", icon: MessageCircle },
    { id: 4, title: "Tutoriais em vídeo", description: "Assista nossos vídeos passo a passo", icon: VideoIcon }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewArticle = (id: number) => {
    // Placeholder for article viewing functionality
    console.log(`Viewing article ${id}`);
    // navigate(`/help-center/article/${id}`);
  };

  const handleViewCategory = (id: number) => {
    // Placeholder for category viewing functionality
    console.log(`Viewing category ${id}`);
    // navigate(`/help-center/category/${id}`);
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Central de Ajuda</h2>
        <p className="text-muted-foreground mt-2">
          Encontre respostas para suas dúvidas e tutoriais para maximizar sua experiência
        </p>
      </div>

      {/* Search section */}
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <HelpCircle className="h-12 w-12 mx-auto text-primary mb-2" />
              <h2 className="text-xl font-semibold">Como podemos ajudar?</h2>
              <p className="text-muted-foreground">Busque por artigos ou navegue pelas categorias abaixo</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por tópico ou palavra-chave"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular articles */}
      <Card>
        <CardHeader>
          <CardTitle>Artigos populares</CardTitle>
          <CardDescription>Os artigos mais acessados pela nossa comunidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map(article => (
              <Button
                key={article.id}
                variant="outline"
                className="justify-start h-auto py-3 px-4"
                onClick={() => handleViewArticle(article.id)}
              >
                <article.icon className="mr-3 h-5 w-5 text-primary" />
                <span>{article.title}</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Navegue por categorias para encontrar informações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewCategory(category.id)}>
                <CardContent className="p-4 flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact support */}
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-1">Ainda precisa de ajuda?</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Nossa equipe de suporte está pronta para ajudar com qualquer dúvida que você tenha.
          </p>
          <Button onClick={handleContactSupport}>
            Contatar Suporte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;
