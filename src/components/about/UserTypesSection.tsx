
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { CheckCircle, Briefcase, Users, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserTypeCard = ({ 
  title, 
  icon, 
  description, 
  features, 
  buttonText, 
  buttonLink, 
  buttonClass,
  bgClass
}) => {
  return (
    <Card className={`p-6 hover:shadow-md transition-shadow border border-gray-100 ${bgClass}`}>
      <div className="flex flex-col h-full">
        <div className={icon.bgClass}>
          {icon.component}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        
        <p className="text-gray-600 mb-5 flex-grow">
          {description}
        </p>
        
        <ul className="space-y-3 mb-5">
          {features.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <Link to={buttonLink} className="mt-auto">
          <Button className={`w-full ${buttonClass}`}>
            {buttonText}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

const UserTypesSection = () => {
  const userTypes = [
    {
      title: "Contratante",
      description: "Pessoas ou empresas que precisam organizar eventos pessoais, corporativos ou sociais e buscam os melhores profissionais e locais para realizá-los.",
      icon: {
        component: <Briefcase className="text-indigo-600 w-7 h-7" />,
        bgClass: "bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-5"
      },
      features: [
        "Publique eventos de qualquer tamanho",
        "Encontre profissionais qualificados", 
        "Receba orçamentos personalizados", 
        "Comunique-se diretamente com prestadores"
      ],
      buttonText: "Cadastrar como Contratante",
      buttonLink: "/register?role=contractor",
      buttonClass: "bg-primary hover:bg-primary/90 text-white",
      bgClass: "bg-gradient-to-br from-indigo-50 to-white"
    },
    {
      title: "Prestador de Serviços",
      description: "Profissionais e empresas especializados em serviços para eventos que buscam aumentar sua visibilidade, conquistar mais clientes e gerenciar projetos.",
      icon: {
        component: <Users className="text-green-600 w-7 h-7" />,
        bgClass: "bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-5"
      },
      features: [
        "Receba solicitações de orçamento", 
        "Expanda sua rede de clientes", 
        "Gerencie seu portfólio online", 
        "Chat integrado com contratantes"
      ],
      buttonText: "Cadastrar como Prestador",
      buttonLink: "/register?role=provider",
      buttonClass: "bg-secondary hover:bg-secondary/90 text-white",
      bgClass: "bg-gradient-to-br from-green-50 to-white"
    },
    {
      title: "Anunciante de Espaços",
      description: "Proprietários ou gestores de locais para eventos que desejam aumentar a ocupação e visibilidade de seus espaços na plataforma.",
      icon: {
        component: <Store className="text-blue-600 w-7 h-7" />,
        bgClass: "bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-5"
      },
      features: [
        "Divulgue seus espaços para eventos", 
        "Gerencie disponibilidade", 
        "Receba solicitações de reserva", 
        "Destaque seus diferenciais"
      ],
      buttonText: "Cadastrar como Anunciante",
      buttonLink: "/register?role=advertiser",
      buttonClass: "bg-accent hover:bg-accent/90 text-white",
      bgClass: "bg-gradient-to-br from-blue-50 to-white"
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Para quem é a Evento+?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {userTypes.map((type, index) => (
          <UserTypeCard key={index} {...type} />
        ))}
      </div>
    </div>
  );
};

export default UserTypesSection;
