
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";

const ServicesPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meus Serviços</h1>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Serviço</CardTitle>
            <CardDescription>Cadastre um novo serviço que você oferece</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 border border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Clique para adicionar um novo serviço</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Divulgue seus serviços</CardTitle>
            <CardDescription>Tenha mais visibilidade para os contratantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 border border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Configure opções de divulgação</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-12 mb-6">Meus Serviços Cadastrados</h2>
      <div className="bg-muted/50 border border-dashed border-muted-foreground/50 rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-2">Você ainda não tem serviços cadastrados</p>
        <p className="text-muted-foreground">Adicione um serviço para começar a receber propostas</p>
      </div>
    </div>
  );
};

export default ServicesPage;
