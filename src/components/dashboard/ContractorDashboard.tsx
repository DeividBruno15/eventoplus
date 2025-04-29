
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Define an interface for our service request data
interface ServiceRequest {
  id: string;
  event_type: string;
  status: string;
  provider: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ContractorDashboardProps {
  userName: string;
}

// This component was renamed to ContractorDashboardContent, so it's now a wrapper for it
const ContractorDashboard = ({ userName }: ContractorDashboardProps) => {
  // Import the actual content component
  const ContractorDashboardContent = require('./ContractorDashboardContent').default;
  
  return <ContractorDashboardContent userName={userName} />;
};

export default ContractorDashboard;
