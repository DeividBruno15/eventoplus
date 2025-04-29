
import { CheckCircle, Clock, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuoteStatus = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos</CardTitle>
        <CardDescription>
          Status dos seus pedidos de orçamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Aceitos</span>
            </div>
            <span className="font-semibold">3</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>Pendentes</span>
            </div>
            <span className="font-semibold">4</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span>Recusados</span>
            </div>
            <span className="font-semibold">1</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Taxa de conversão</h4>
          <Progress value={75} className="h-2" />
          <p className="text-sm text-gray-500 mt-2">75% dos seus pedidos são aceitos</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" onClick={() => navigate("/events")}>
          Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
