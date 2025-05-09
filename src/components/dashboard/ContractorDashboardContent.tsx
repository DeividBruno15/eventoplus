
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Users, MessageSquare, BarChart4, CheckCircle, Clock, X, ExternalLink, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnboardingCard } from "@/components/dashboard/OnboardingCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UpcomingEvents } from "./dashboard-sections/UpcomingEvents";
import { QuoteStatus } from "./dashboard-sections/QuoteStatus";
import { RecentProviders } from "./dashboard-sections/RecentProviders";
import { QuickActions } from "./dashboard-sections/QuickActions";

interface ContractorDashboardContentProps {
  userName: string;
}

const ContractorDashboardContent = ({ userName }: ContractorDashboardContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <OnboardingCard />
      
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Olá, {userName}!</h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
          Bem-vindo(a) ao seu Dashboard de Contratante.
        </p>
      </div>
      
      <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingEvents navigate={navigate} />
        <QuoteStatus />
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentProviders navigate={navigate} />
        <QuickActions navigate={navigate} />
      </div>
    </div>
  );
};

export default ContractorDashboardContent;
