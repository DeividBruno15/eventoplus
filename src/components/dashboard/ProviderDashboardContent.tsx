
import { useNavigate } from "react-router-dom";
import { Calendar, MessageSquare, Settings, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnboardingCard } from "@/components/dashboard/OnboardingCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProviderStats } from "./dashboard-sections/ProviderStats";
import { ServiceRequests } from "./dashboard-sections/ServiceRequests";
import { ProviderPerformance } from "./dashboard-sections/ProviderPerformance";
import { ProviderQuickActions } from "./dashboard-sections/ProviderQuickActions";

interface ProviderDashboardContentProps {
  userName: string;
}

const ProviderDashboardContent = ({ userName }: ProviderDashboardContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <OnboardingCard />
      
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
          Bem-vindo(a) ao seu Dashboard de Prestador de Serviços.
        </p>
      </div>
      
      <ProviderStats />
      
      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        <ServiceRequests navigate={navigate} />
        <ProviderPerformance navigate={navigate} />
      </div>
      
      <ProviderQuickActions navigate={navigate} />
    </div>
  );
};

export default ProviderDashboardContent;
