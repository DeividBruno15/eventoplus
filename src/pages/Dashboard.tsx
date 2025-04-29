
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { OnboardingCard } from "@/components/dashboard/OnboardingCard";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import ProviderDashboardContent from "@/components/dashboard/ProviderDashboardContent";
import DashboardLayout from "@/layouts/DashboardLayout";

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
    return (
      <DashboardLayout>
        <ProviderDashboardContent userName={userName} />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <ContractorDashboard userName={userName} />
    </DashboardLayout>
  );
};

export default Dashboard;
