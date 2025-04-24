
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho de boas-vindas */}
      <div>
        <h1 className="text-2xl font-bold">Olá, {userName}!</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) ao seu Dashboard da plataforma Evento+.
        </p>
      </div>
      
      {/* Aviso para completar cadastro se necessário */}
      {!isOnboardingComplete && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Complete seu cadastro</h3>
                <p className="text-amber-700 mt-1">
                  Para aproveitar todas as funcionalidades da plataforma, complete as informações do seu perfil.
                </p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="ml-auto bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded"
              >
                Completar
              </button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'contractor' ? 'Orçamentos Solicitados' : 'Solicitações Recebidas'}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma solicitação no momento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="m2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              3 novas mensagens não lidas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Conteúdo específico de acordo com o perfil */}
      {userRole === 'contractor' ? (
        <ContractorDashboard />
      ) : userRole === 'provider' ? (
        <ProviderDashboard />
      ) : null}
    </div>
  );
};

export default Dashboard;
