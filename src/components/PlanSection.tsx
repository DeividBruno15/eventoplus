
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PricingTable } from "../pages/Plans/components/PricingTable";
import { providerPlans, contractorPlans } from "../pages/Plans/data/plans";

const PlanSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Planos e Benefícios</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
      </div>
    </section>
  );
};

export default PlanSection;
