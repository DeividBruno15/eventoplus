
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { providerPlans, contractorPlans, advertiserPlans } from "../pages/Plans/data/plans";

const PlanSection = () => {
  const PricingTable = ({ plans, features }: { plans: any[], features: string[] }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header with plan names and prices */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-6 font-medium text-gray-600 bg-gray-50">Funcionalidades</th>
                {plans.map((plan, index) => (
                  <th key={plan.id} className="p-6 text-center bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          {plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(2).replace('.', ',')}`}
                        </span>
                        {plan.price > 0 && <span className="text-gray-600 text-sm">/mês</span>}
                      </div>
                      <Button 
                        className={`w-full ${index === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                        size="sm"
                      >
                        Assinar
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Features comparison */}
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr key={featureIndex} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">{feature}</td>
                  {plans.map((plan, planIndex) => (
                    <td key={plan.id} className="p-4 text-center">
                      {plan.benefits.includes(feature) ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Define features for each user type
  const providerFeatures = [
    "Perfil público básico",
    "Conectividade com clientes",
    "Mensagens com contratantes",
    "Receber avaliações",
    "Anunciar serviços",
    "Destaque em busca",
    "Relatórios de vendas",
    "Estatísticas e métricas",
    "Suporte"
  ];

  const contractorFeatures = [
    "Busca ilimitada",
    "Favoritar perfis",
    "Avaliar prestadores",
    "Histórico básico",
    "Contato direto sem limite",
    "Briefings personalizados",
    "Agendamento e lembretes",
    "Histórico completo com exportação",
    "Suporte"
  ];

  const advertiserFeatures = [
    "Cadastro de locais",
    "Fotos e descrições",
    "Aparecimento no diretório",
    "Recebimento de leads",
    "Estatísticas simples",
    "Destaque em buscas",
    "Visibilidade segmentada",
    "Vídeos e tours virtuais",
    "Suporte"
  ];

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
            <PricingTable plans={providerPlans} features={providerFeatures} />
          </TabsContent>
          
          <TabsContent value="contractors" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-600">
                Para organizadores de eventos que buscam os melhores profissionais e serviços.
              </p>
            </div>
            <PricingTable plans={contractorPlans} features={contractorFeatures} />
          </TabsContent>
          
          <TabsContent value="advertisers" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-600">
                Para proprietários de espaços que desejam aumentar a visibilidade e atrair mais eventos.
              </p>
            </div>
            <PricingTable plans={advertiserPlans} features={advertiserFeatures} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PlanSection;
