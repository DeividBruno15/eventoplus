
import { CheckCircle, Clock, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuoteStatus = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-2xl">Orçamentos</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Status dos seus pedidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 md:gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-sm">Aceitos</span>
            </div>
            <span className="text-sm md:text-base font-semibold">3</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
              <span className="text-sm">Pendentes</span>
            </div>
            <span className="text-sm md:text-base font-semibold">4</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 md:gap-2">
              <X className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
              <span className="text-sm">Recusados</span>
            </div>
            <span className="text-sm md:text-base font-semibold">1</span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6">
          <h4 className="text-xs md:text-sm font-medium mb-2">Taxa de conversão</h4>
          <Progress value={75} className="h-2" />
          <p className="text-xs md:text-sm text-gray-500 mt-2">75% dos pedidos são aceitos</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-xs md:text-sm" onClick={() => navigate("/events")}>
          Ver Todos <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
