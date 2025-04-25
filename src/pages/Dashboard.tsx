import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, ArrowRight, Calendar, Users, MessageSquare, BarChart4 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const userRole = session?.user?.user_metadata?.role;
  const userName = session?.user?.user_metadata?.first_name || 'Usuário';
  const isOnboardingComplete = session?.user?.user_metadata?.is_onboarding_complete;

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

  const stats = [
    {
      title: "Total de Eventos",
      value: "12",
      description: "+20% em relação ao mês anterior",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Usuários Ativos",
      value: "320",
      description: "+12% novos usuários",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Mensagens",
      value: "28",
      description: "5 não lidas",
      icon: MessageSquare,
      color: "bg-purple-500"
    },
    {
      title: "Receita Mensal",
      value: "R$ 25.600",
      description: "+8% em relação ao mês anterior",
      icon: BarChart4,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <OnboardingCard />
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-muted-foreground mt-2">
          Bem-vindo(a) ao seu Dashboard da plataforma Evento+.
        </p>
      </div>
      
      {!isOnboardingComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">Complete seu cadastro</h3>
                <p className="text-muted-foreground mt-1">
                  Para aproveitar todas as funcionalidades da plataforma, complete as informações do seu perfil.
                </p>
                <Button 
                  onClick={() => navigate('/profile')}
                  className="mt-4"
                  size="sm"
                >
                  Completar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} text-white rounded p-0.5`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Seus eventos agendados para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Evento {i + 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens Recentes</CardTitle>
            <CardDescription>
              Últimas mensagens recebidas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-500">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Usuário {i + 1}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Última mensagem do usuário {i + 1}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Atalhos para ações comuns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/events/create')}>
              <Calendar className="mr-2 h-4 w-4" />
              Criar Novo Evento
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/chat')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Iniciar Conversa
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
              <Users className="mr-2 h-4 w-4" />
              Atualizar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
