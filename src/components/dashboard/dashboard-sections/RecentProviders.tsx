
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigateFunction } from "react-router-dom";

interface RecentProvidersProps {
  navigate: NavigateFunction;
}

export const RecentProviders = ({ navigate }: RecentProvidersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestadores Recentes</CardTitle>
        <CardDescription>
          Prestadores de serviços que você contratou
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {String.fromCharCode(65 + i)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Prestador {i}
              </p>
              <p className="text-xs text-gray-500">
                {i === 1 ? 'Buffet' : i === 2 ? 'Decoração' : 'Fotografia'}
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {i === 1 ? 'Novo' : 'Recorrente'}
            </Badge>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" onClick={() => navigate("/service-providers")}>
          Ver Todos <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
