
import { useNavigate } from "react-router-dom";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return <ContractorDashboard />;
};

export default Dashboard;
