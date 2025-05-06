
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";
import AdvertiserDashboard from "@/components/dashboard/AdvertiserDashboard";
import { useAuth } from "@/hooks/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'contractor';

  const renderDashboard = () => {
    switch (userRole) {
      case 'provider':
        return <ProviderDashboard />;
      case 'advertiser':
        return <AdvertiserDashboard />;
      case 'contractor':
      default:
        return <ContractorDashboard />;
    }
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
};

export default Dashboard;
