
import { Search, MessageSquare, Star, MapPin } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      title: 'Encontre prestadores e espaços',
      description: 'Conectamos você a profissionais qualificados e locais ideais para garantir o sucesso do seu evento.',
      icon: <Search className="w-12 h-12 text-primary mb-4" />
    },
    {
      title: 'Solicite orçamentos personalizados',
      description: 'Descreva suas necessidades e receba propostas detalhadas dos melhores prestadores.',
      icon: <MessageSquare className="w-12 h-12 text-primary mb-4" />
    },
    {
      title: 'Compare e escolha a melhor opção',
      description: 'Analise perfis, avaliações e preços para tomar a decisão mais adequada ao seu evento.',
      icon: <Star className="w-12 h-12 text-primary mb-4" />
    },
    {
      title: 'Anuncie seus espaços para eventos',
      description: 'Proprietários de locais podem cadastrar e divulgar seus espaços para organizadores de eventos.',
      icon: <MapPin className="w-12 h-12 text-primary mb-4" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Como funciona o Evento+</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra como nossa plataforma facilita o planejamento do seu evento, conectando você aos melhores profissionais e locais do mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-muted shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
