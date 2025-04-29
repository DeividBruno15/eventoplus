
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
      <CardHeader>
        <CardTitle>Desempenho</CardTitle>
        <CardDescription>
          Análise de desempenho dos seus serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Visitas ao perfil</h4>
            <span className="text-sm text-gray-500">+15%</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Taxa de resposta</h4>
            <span className="text-sm text-gray-500">95%</span>
          </div>
          <Progress value={95} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Avaliações positivas</h4>
            <span className="text-sm text-gray-500">92%</span>
          </div>
          <Progress value={92} className="h-2" />
        </div>
        
        <div className="pt-4">
          <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
            Ver Análise Completa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
