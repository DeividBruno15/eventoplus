
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PricingTable } from "../pages/Plans/components/PricingTable";
import { providerPlans, contractorPlans, advertiserPlans } from "../pages/Plans/data/plans";

const PlanSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Planos e benefícios</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades e comece a crescer conosco. 
            Todos os planos incluem suporte e atualizações gratuitas.
          </p>
        </div>

        <Tabs defaultValue="providers" className="space-y-12">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto h-12">
            <TabsTrigger value="providers" className="text-sm">Para Prestadores</TabsTrigger>
            <TabsTrigger value="contractors" className="text-sm">Para Contratantes</TabsTrigger>
            <TabsTrigger value="advertisers" className="text-sm">Para Anunciantes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-600">
                Para prestadores de serviços que desejam expandir seus negócios e conectar-se com mais clientes.
              </p>
            </div>
            <PricingTable plans={providerPlans} />
          </TabsContent>
          
          <TabsContent value="contractors" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-600">
                Para organizadores de eventos que buscam os melhores profissionais e serviços.
              </p>
            </div>
            <PricingTable plans={contractorPlans} />
          </TabsContent>
          
          <TabsContent value="advertisers" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-600">
                Para proprietários de espaços que desejam aumentar a visibilidade e atrair mais eventos.
              </p>
            </div>
            <PricingTable plans={advertiserPlans} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PlanSection;
