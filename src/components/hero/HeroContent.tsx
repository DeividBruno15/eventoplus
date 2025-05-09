
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

const HeroContent = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 md:space-y-6"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900">
          Organize eventos, encontre profissionais
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
          Conectamos contratantes, prestadores de serviços e anunciantes para criar eventos inesquecíveis.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 md:gap-4"
      >
        <Link to="/register">
          <Button 
            variant="default"
            size="lg"
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 h-auto text-sm md:text-base font-medium shadow-lg shadow-primary/20"
          >
            Começar agora
          </Button>
        </Link>
        <Link to="/about">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 h-auto text-sm md:text-base font-medium border-primary text-primary hover:bg-primary/5"
          >
            Saiba mais
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap gap-3 md:gap-5 pt-1 md:pt-2"
      >
        <div className="flex items-center gap-1 md:gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-3 w-3 md:h-4 md:w-4" />
          </div>
          <span className="text-xs md:text-sm text-gray-600">Profissionais verificados</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-3 w-3 md:h-4 md:w-4" />
          </div>
          <span className="text-xs md:text-sm text-gray-600">Contratação simplificada</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-3 w-3 md:h-4 md:w-4" />
          </div>
          <span className="text-xs md:text-sm text-gray-600">Comunicação direta</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
