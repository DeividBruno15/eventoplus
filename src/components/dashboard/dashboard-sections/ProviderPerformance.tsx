
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NavigateFunction } from "react-router-dom";

interface ProviderPerformanceProps {
  navigate: NavigateFunction;
}

export const ProviderPerformance = ({ navigate }: ProviderPerformanceProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-2xl">Desempenho</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Análise de seus serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 md:mb-2">
            <h4 className="text-xs md:text-sm font-medium">Visitas ao perfil</h4>
            <span className="text-xs md:text-sm text-gray-500">+15%</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1 md:mb-2">
            <h4 className="text-xs md:text-sm font-medium">Taxa de resposta</h4>
            <span className="text-xs md:text-sm text-gray-500">95%</span>
          </div>
          <Progress value={95} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1 md:mb-2">
            <h4 className="text-xs md:text-sm font-medium">Avaliações positivas</h4>
            <span className="text-xs md:text-sm text-gray-500">92%</span>
          </div>
          <Progress value={92} className="h-2" />
        </div>
        
        <div className="pt-2 md:pt-4">
          <Button variant="outline" className="w-full text-xs md:text-sm" onClick={() => navigate("/profile")}>
            Ver Análise Completa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
