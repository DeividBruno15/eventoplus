
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";
import AdvertiserDashboard from "@/components/dashboard/AdvertiserDashboard";
import { useAuth } from "@/hooks/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'contractor';

  console.log("Dashboard - Current user role:", userRole);

  const renderDashboard = () => {
    switch (userRole) {
      case 'provider':
        console.log("Rendering Provider Dashboard");
        return <ProviderDashboard />;
      case 'advertiser':
        console.log("Rendering Advertiser Dashboard");
        return <AdvertiserDashboard />;
      case 'contractor':
      default:
        console.log("Rendering Contractor Dashboard");
        return <ContractorDashboard />;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
