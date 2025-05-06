
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

const HeroContent = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
          Organize eventos, encontre profissionais e locais perfeitos
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
          Conectamos contratantes, prestadores de serviços e anunciantes de espaços para criar eventos inesquecíveis.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/register">
          <Button 
            variant="default"
            size="lg"
            className="px-8 py-6 h-auto text-lg font-medium shadow-lg shadow-primary/20"
          >
            Começar agora
          </Button>
        </Link>
        <Link to="/about">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 h-auto text-lg font-medium border-primary text-primary hover:bg-primary/5"
          >
            Saiba mais
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap gap-5 pt-2"
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-4 w-4" />
          </div>
          <span className="text-sm text-gray-600">Profissionais verificados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-4 w-4" />
          </div>
          <span className="text-sm text-gray-600">Contratação simplificada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-4 w-4" />
          </div>
          <span className="text-sm text-gray-600">Comunicação direta</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
