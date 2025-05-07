
import React from 'react';
import { useAuth } from "@/hooks/auth";
import ContractorDashboardContent from "@/components/dashboard/ContractorDashboardContent";

const ContractorDashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.first_name || 'Usuário';
  
  // Only render contractor content, provider content is handled separately by ProviderDashboard component
  return <ContractorDashboardContent userName={userName} />;
};

export default ContractorDashboard;
