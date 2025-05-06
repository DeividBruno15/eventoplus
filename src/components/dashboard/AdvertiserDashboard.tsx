
import { useNavigate } from "react-router-dom";
import { Building, Eye, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "./DashboardHeader";

const AdvertiserDashboard = () => {
  const navigate = useNavigate();

  // This would typically come from your API
  const dashboardData = {
    totalVenues: 3,
    totalViews: 153,
    topVenues: [
      { id: "1", name: "Salão de Festas Premium", views: 78, rating: 4.8 },
      { id: "2", name: "Espaço Jardim Eventos", views: 42, rating: 4.5 },
    ],
    pendingApprovals: 1,
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Visão Geral"
        description="Bem-vindo de volta ao seu painel de anunciante"
        action={
          <Button onClick={() => navigate("/venues/create")}>
            Criar Anúncio
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Anúncios</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalVenues}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalViews}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliações</p>
                <h3 className="text-2xl font-bold">4.6</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovações Pendentes</p>
                <h3 className="text-2xl font-bold">{dashboardData.pendingApprovals}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top performing venues */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Anúncios em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.topVenues.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topVenues.map((venue) => (
                <div key={venue.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{venue.name}</h4>
                      <div className="flex items-center gap-4 mt-1.5">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{venue.views} visualizações</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span>{venue.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/venues/${venue.id}`)}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Seus anúncios aparecerão aqui quando começarem a receber visualizações
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => navigate("/venues")}
          >
            Ver todos os anúncios
          </Button>
        </CardFooter>
      </Card>

      {/* Quick tips */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Dicas para um bom anúncio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center text-primary font-medium">1</div>
              <div>
                <h4 className="font-medium">Adicione fotos de qualidade</h4>
                <p className="text-sm text-muted-foreground">Imagens bem iluminadas e de diferentes ângulos aumentam o interesse.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center text-primary font-medium">2</div>
              <div>
                <h4 className="font-medium">Seja detalhado na descrição</h4>
                <p className="text-sm text-muted-foreground">Inclua todas as comodidades e diferenciais do seu espaço.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center text-primary font-medium">3</div>
              <div>
                <h4 className="font-medium">Mantenha informações atualizadas</h4>
                <p className="text-sm text-muted-foreground">Preços, disponibilidade e regras sempre em dia.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertiserDashboard;
