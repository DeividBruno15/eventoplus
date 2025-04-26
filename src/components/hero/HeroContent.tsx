
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

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
          Organize eventos com facilidade e encontre os melhores prestadores
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
          Conectamos contratantes a prestadores de serviços qualificados para tornar seu evento inesquecível.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link 
          to="/register" 
          className="btn-primary text-center px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors shadow-lg shadow-primary/20 animate-scale-in"
        >
          Começar agora
        </Link>
        <Link 
          to="/about" 
          className="btn-outline text-center px-8 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-medium transition-colors animate-scale-in"
        >
          Saiba mais
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
          <span className="text-sm text-gray-600">Sem taxas ocultas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-4 w-4" />
          </div>
          <span className="text-sm text-gray-600">Chat integrado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <Check className="text-primary h-4 w-4" />
          </div>
          <span className="text-sm text-gray-600">Orçamentos personalizados</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
