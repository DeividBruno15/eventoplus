
import { Users, Briefcase, Badge } from 'lucide-react';
import { motion } from 'framer-motion';

const UserTypeCard = ({ 
  title, 
  description, 
  icon, 
  color 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className={`p-4 rounded-full ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const UserTypeSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Encontre seu perfil na Evento+</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma conecta diferentes tipos de usuários para criar eventos perfeitos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UserTypeCard 
            title="Contratante"
            description="Organize seus eventos e encontre os melhores prestadores de serviços e locais para torná-los inesquecíveis."
            icon={<Users className="w-8 h-8 text-white" />}
            color="bg-primary"
          />
          
          <UserTypeCard 
            title="Prestador de Serviços"
            description="Ofereça seus serviços para eventos, seja encontrado por potenciais clientes e expanda seus negócios."
            icon={<Briefcase className="w-8 h-8 text-white" />}
            color="bg-secondary"
          />
          
          <UserTypeCard 
            title="Anunciante de Espaços"
            description="Anuncie seu espaço para eventos, aumente sua visibilidade e maximize a ocupação do seu estabelecimento."
            icon={<Badge className="w-8 h-8 text-white" />}
            color="bg-accent"
          />
        </div>
      </div>
    </section>
  );
};

export default UserTypeSection;
