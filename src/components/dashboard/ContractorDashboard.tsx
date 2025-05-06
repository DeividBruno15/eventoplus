
import React from 'react';
import { useAuth } from "@/hooks/auth";
import ContractorDashboardContent from "@/components/dashboard/ContractorDashboardContent";
import ProviderDashboardContent from "@/components/dashboard/ProviderDashboardContent";

const ContractorDashboard = () => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const userName = user?.user_metadata?.first_name || 'Usuário';

  // Different content based on user role
  if (userRole === 'provider') {
    return <ProviderDashboardContent userName={userName} />;
  }
  
  return <ContractorDashboardContent userName={userName} />;
};

export default ContractorDashboard;
