
import { Calendar, MessageCircle, Users, Building, MapPin, Award } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {icon}
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-indigo-500 mb-4" />,
      title: "Gestão de Eventos",
      description: "Crie, organize e gerencie seus eventos de forma simples e intuitiva com nosso sistema completo."
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-indigo-500 mb-4" />,
      title: "Chat Integrado",
      description: "Comunique-se diretamente com prestadores, contratantes ou anunciantes através de nossa plataforma."
    },
    {
      icon: <Users className="h-10 w-10 text-indigo-500 mb-4" />,
      title: "Conexões Relevantes",
      description: "Conecte-se aos melhores prestadores de serviços especializados para seu tipo de evento."
    },
    {
      icon: <Building className="h-10 w-10 text-indigo-500 mb-4" />,
      title: "Espaços para Eventos",
      description: "Encontre ou anuncie os melhores locais para realizar eventos de todos os tipos e tamanhos."
    },
    {
      icon: <MapPin className="h-10 w-10 text-indigo-500 mb-4" />,
      title: "Localização Inteligente",
      description: "Encontre profissionais e espaços próximos ao local do seu evento, economizando em logística."
    },
    {
      icon: <Award className="h-10 w-10 text-indigo-500 mb-4" />,
      title: "Profissionais Verificados",
      description: "Todos os prestadores de serviço e espaços passam por verificação e são avaliados por outros usuários."
    }
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-center">O que oferecemos</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
