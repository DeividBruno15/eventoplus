
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Users, Briefcase, MapPin } from 'lucide-react';

const UserTypeSection = () => {
  const userTypes = [
    {
      icon: Users,
      title: "Contratantes",
      description: "Encontre os melhores profissionais para seus eventos. Compare orçamentos, avalie prestadores e organize eventos perfeitos.",
      features: [
        "Busca por categoria e localização",
        "Compare múltiplos orçamentos",
        "Avaliações de outros clientes",
        "Comunicação direta com prestadores"
      ],
      cta: "Começar como Contratante",
      link: "/register?role=contractor"
    },
    {
      icon: Briefcase,
      title: "Prestadores de Serviços",
      description: "Divulgue seus serviços, conecte-se com clientes e faça seu negócio crescer na maior plataforma de eventos.",
      features: [
        "Perfil profissional completo",
        "Receba solicitações de orçamento",
        "Avaliações e recomendações",
        "Ferramentas de gestão"
      ],
      cta: "Cadastrar como Prestador",
      link: "/register?role=provider"
    },
    {
      icon: MapPin,
      title: "Anunciantes de Espaços",
      description: "Anuncie seus espaços para eventos e conecte-se diretamente com organizadores. Aumente sua ocupação e visibilidade.",
      features: [
        "Divulgação de múltiplos espaços",
        "Calendário de disponibilidade",
        "Fotos e descrições detalhadas",
        "Leads qualificados"
      ],
      cta: "Anunciar Espaços",
      link: "/register?role=advertiser"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Encontre seu perfil na Evento+</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma atende diferentes necessidades. Descubra como podemos ajudar você a alcançar seus objetivos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{type.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={type.link} className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    {type.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserTypeSection;
