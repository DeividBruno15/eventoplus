
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, ArrowRight, Calendar, Users, MessageSquare, BarChart4, CheckCircle, Clock, X, ExternalLink, Briefcase, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnboardingCard } from "@/components/dashboard/OnboardingCard";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.user_metadata?.role;
  const userName = user?.user_metadata?.first_name || 'Usuário';

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Different data based on user role
  if (userRole === 'provider') {
    return <ProviderDashboard userName={userName} />;
  }
  
  return <ContractorDashboardContent userName={userName} />;
};

const ContractorDashboardContent = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();
  
  const upcomingEvents = [
    { id: 1, title: "Reunião de Equipe", date: "25 de Julho, 2025", location: "São Paulo, SP", status: "confirmado" },
    { id: 2, title: "Workshop de Marketing", date: "10 de Agosto, 2025", location: "Rio de Janeiro, RJ", status: "pendente" },
    { id: 3, title: "Conferência Anual", date: "15 de Setembro, 2025", location: "Belo Horizonte, MG", status: "planejamento" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <OnboardingCard />
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-muted-foreground mt-2">
          Bem-vindo(a) ao seu Dashboard de Contratante.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos que você está organizando
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {event.title}
                    </h3>
                    <Badge variant={
                      event.status === 'confirmado' ? 'default' :
                      event.status === 'pendente' ? 'secondary' : 'outline'
                    }>
                      {event.status === 'confirmado' ? 'Confirmado' :
                       event.status === 'pendente' ? 'Pendente' : 'Planejamento'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.date}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.location}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/events/create")}>
              Criar Novo Evento
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orçamentos</CardTitle>
            <CardDescription>
              Status dos seus pedidos de orçamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Aceitos</span>
                </div>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span>Pendentes</span>
                </div>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>Recusados</span>
                </div>
                <span className="font-semibold">1</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Taxa de conversão</h4>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">75% dos seus pedidos são aceitos</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/events")}>
              Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Prestadores Recentes</CardTitle>
            <CardDescription>
              Prestadores de serviços que você contratou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Prestador {i}
                  </p>
                  <p className="text-xs text-gray-500">
                    {i === 1 ? 'Buffet' : i === 2 ? 'Decoração' : 'Fotografia'}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {i === 1 ? 'Novo' : 'Recorrente'}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/service-providers")}>
              Ver Todos <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Atalhos para ações comuns
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" onClick={() => navigate('/events/create')}>
              <Calendar className="mr-2 h-4 w-4" />
              Criar Novo Evento
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/service-providers')}>
              <Users className="mr-2 h-4 w-4" />
              Procurar Prestadores
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/chat')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Iniciar Conversa
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/profile')}>
              <Briefcase className="mr-2 h-4 w-4" />
              Atualizar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProviderDashboard = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();
  
  const serviceRequests = [
    { id: 1, title: "Orçamento para Festa", client: "João Silva", status: "novo", date: "14/05/2025", type: "Buffet" },
    { id: 2, title: "Casamento 150 pessoas", client: "Maria Oliveira", status: "em análise", date: "28/04/2025", type: "Decoração" },
    { id: 3, title: "Evento Corporativo", client: "Empresa ABC", status: "orçamento enviado", date: "05/04/2025", type: "Iluminação" },
  ];
  
  const stats = [
    { title: "Solicitações", value: "15", change: "+4", status: "positive" },
    { title: "Taxa de Conversão", value: "68%", change: "+2.5%", status: "positive" },
    { title: "Avaliação", value: "4.8", change: "0", status: "neutral" },
    { title: "Tempo de Resposta", value: "2h", change: "-30min", status: "positive" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <OnboardingCard />
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-muted-foreground mt-2">
          Bem-vindo(a) ao seu Dashboard de Prestador de Serviços.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.title}
              </p>
              <div className={`text-xs mt-2 flex items-center ${
                stat.status === 'positive' ? 'text-green-500' : 
                stat.status === 'negative' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {stat.status === 'positive' ? '↑' : 
                 stat.status === 'negative' ? '↓' : '•'} {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
            <CardDescription>
              Pedidos de orçamento e solicitações de serviço
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{request.title}</h3>
                  <Badge variant={
                    request.status === 'novo' ? 'default' :
                    request.status === 'em análise' ? 'secondary' : 'outline'
                  }>
                    {request.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Cliente: {request.client}</p>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>Tipo: {request.type}</span>
                  <span>Recebido em: {request.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/events")}>
              Ver Todas as Solicitações
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Desempenho</CardTitle>
            <CardDescription>
              Análise de desempenho dos seus serviços
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Visitas ao perfil</h4>
                <span className="text-sm text-gray-500">+15%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Taxa de resposta</h4>
                <span className="text-sm text-gray-500">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Avaliações positivas</h4>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
                Ver Análise Completa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Atalhos para ações comuns
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start" onClick={() => navigate('/profile')}>
              <Briefcase className="mr-2 h-4 w-4" />
              Atualizar Serviços
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/events')}>
              <Calendar className="mr-2 h-4 w-4" />
              Gerenciar Eventos
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/chat')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Conversas
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
