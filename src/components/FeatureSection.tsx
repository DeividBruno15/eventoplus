
import { Users, Search, MapPin } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Users,
      title: "Compare e escolha o melhor orçamento",
      description: "Receba múltiplas propostas de profissionais qualificados e escolha a melhor opção para seu evento."
    },
    {
      icon: Search,
      title: "Encontre prestadores e espaços",
      description: "Busque por categoria, localização e avaliações para encontrar os melhores prestadores e espaços."
    },
    {
      icon: MapPin,
      title: "Anuncie seus espaços para eventos",
      description: "Proprietários de espaços podem anunciar seus locais e conectar-se com organizadores de eventos."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Como funciona o Evento+</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma conecta contratantes, prestadores de serviços e anunciantes de espaços, 
            facilitando a organização de eventos perfeitos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
