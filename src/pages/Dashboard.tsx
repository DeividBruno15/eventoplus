
import { useSession } from "@/contexts/SessionContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const userRole = session?.user?.user_metadata?.role;

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
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      {userRole === 'contractor' ? (
        <ContractorDashboard />
      ) : userRole === 'provider' ? (
        <ProviderDashboard />
      ) : null}
    </div>
  );
};

export default Dashboard;
