
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, Music, Utensils, PartyPopper, 
  Palette, Sparkles, Users, Lightbulb 
} from 'lucide-react';

const categories = [
  { 
    icon: Camera, 
    name: "Fotografia", 
    description: "Capture momentos especiais",
    color: "from-blue-500/10 to-blue-600/10" 
  },
  { 
    icon: Music, 
    name: "Música", 
    description: "Trilha sonora perfeita",
    color: "from-purple-500/10 to-purple-600/10"
  },
  { 
    icon: Utensils, 
    name: "Buffet", 
    description: "Gastronomia excepcional",
    color: "from-orange-500/10 to-orange-600/10"
  },
  { 
    icon: PartyPopper, 
    name: "Decoração", 
    description: "Ambientes únicos",
    color: "from-pink-500/10 to-pink-600/10"
  },
  { 
    icon: Palette, 
    name: "Design", 
    description: "Identidade visual",
    color: "from-green-500/10 to-green-600/10"
  },
  { 
    icon: Sparkles, 
    name: "Entretenimento", 
    description: "Diversão garantida",
    color: "from-yellow-500/10 to-yellow-600/10"
  },
  { 
    icon: Users, 
    name: "Staff", 
    description: "Equipe profissional",
    color: "from-red-500/10 to-red-600/10"
  },
  { 
    icon: Lightbulb, 
    name: "Iluminação", 
    description: "Luz e atmosfera",
    color: "from-indigo-500/10 to-indigo-600/10"
  }
];

const ServiceCategories = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50/50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Serviços para todos os tipos de eventos
          </h2>
          <p className="text-lg text-gray-600">
            Encontre os melhores profissionais em cada categoria para tornar seu evento inesquecível
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/service-providers?category=${category.name.toLowerCase()}`}
                className="block group"
              >
                <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${category.color} backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
                  <div className="absolute inset-0 bg-white/40 rounded-2xl transition-opacity group-hover:opacity-0" />
                  <div className="relative">
                    <category.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
