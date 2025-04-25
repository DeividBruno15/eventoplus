import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, Music, Utensils, PartyPopper, 
  Palette, Sparkles, Users, Lightbulb 
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge className="mb-3 px-3 py-1 bg-primary/10 text-primary border-none">Serviços</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Serviços para todos os tipos de eventos
          </h2>
          <p className="text-lg text-gray-600">
            Encontre os melhores profissionais em cada categoria para tornar seu evento inesquecível
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="h-full relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-primary/20"
            >
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4`}>
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
