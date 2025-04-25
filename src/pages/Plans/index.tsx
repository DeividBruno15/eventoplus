
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PricingTable } from "./components/PricingTable";
import { providerPlans, contractorPlans } from "./data/plans";

const Plans = () => {
  return (
    <div className="min-h-screen bg-page">
      <main className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Planos e Benefícios
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o plano ideal para suas necessidades e comece a crescer conosco
          </p>
        </div>

        <Tabs defaultValue="providers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
            <TabsTrigger value="providers">Para Prestadores</TabsTrigger>
            <TabsTrigger value="contractors">Para Contratantes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-4">
            <PricingTable plans={providerPlans} />
          </TabsContent>
          
          <TabsContent value="contractors" className="space-y-4">
            <PricingTable plans={contractorPlans} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Plans;
