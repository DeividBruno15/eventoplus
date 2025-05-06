
import { ReactNode } from "react";
import { useSession } from "@/contexts/SessionContext";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

const DashboardHeader = ({ title, description, action }: DashboardHeaderProps) => {
  const { session } = useSession();
  const userName = session?.user?.user_metadata?.first_name || 'Usuário';

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {title || `Bem-vindo(a), ${userName}`}
          </h1>
          <p className="text-gray-600 mt-1">
            {description || "Gerencie seus serviços e solicitações"}
          </p>
        </div>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
