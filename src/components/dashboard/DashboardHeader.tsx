
import { useSession } from "@/contexts/SessionContext";
import { Card, CardContent } from "@/components/ui/card";

const DashboardHeader = () => {
  const { session } = useSession();
  const userName = session?.user?.user_metadata?.first_name || 'Usuário';

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bem-vindo(a), {userName}
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie seus serviços e solicitações
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
