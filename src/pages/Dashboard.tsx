
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";

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

  return (
    <div className="space-y-6">
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {userRole === 'contractor' ? 'Orçamentos Solicitados' : 'Solicitações Recebidas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma solicitação no momento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Mensagens não lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              3 novas mensagens não lidas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {userRole === 'contractor' ? (
        <ContractorDashboard />
      ) : userRole === 'provider' ? (
        <ProviderDashboard />
      ) : null}
    </div>
  );
};

export default Dashboard;
