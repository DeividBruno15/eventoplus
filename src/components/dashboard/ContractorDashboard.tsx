
import ContractorDashboardContent from "@/components/dashboard/ContractorDashboardContent";

interface ContractorDashboardProps {
  userName: string;
}

const ContractorDashboard = ({ userName }: ContractorDashboardProps) => {
  return <ContractorDashboardContent userName={userName} />;
};

export default ContractorDashboard;
