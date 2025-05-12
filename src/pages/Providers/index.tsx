
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ProvidersPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Encontrar Prestadores</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Busca de Prestadores</CardTitle>
          <CardDescription>Encontre prestadores para o seu evento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Buscar por tipo de serviço (DJ, fotógrafo...)" />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mt-12 mb-6">Prestadores Sugeridos</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg h-40 mb-4"></div>
              <h3 className="font-bold">Prestador de Serviço #{i}</h3>
              <p className="text-sm text-muted-foreground">Fotografia, Filmagem</p>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">Ver Perfil</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProvidersPage;
