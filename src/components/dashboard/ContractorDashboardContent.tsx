
import { useNavigate } from "react-router-dom";
import { UpcomingEvents } from "./dashboard-sections/UpcomingEvents";
import { RecentProviders } from "./dashboard-sections/RecentProviders";
import { QuickActions } from "./dashboard-sections/QuickActions";

interface ContractorDashboardContentProps {
  userName: string;
}

const ContractorDashboardContent = ({ userName }: ContractorDashboardContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
          Bem-vindo(a) ao seu Dashboard de Contratante.
        </p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-2">
          <UpcomingEvents navigate={navigate} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <RecentProviders navigate={navigate} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <QuickActions navigate={navigate} />
      </div>
    </div>
  );
};

export default ContractorDashboardContent;
