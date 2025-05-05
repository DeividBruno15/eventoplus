
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-95 z-0"></div>
      
      {/* Padrão decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-white" 
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-6 border border-white/30 backdrop-blur-sm"
          >
            <span className="text-sm font-medium">Comece agora mesmo</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-6 leading-tight"
          >
            Pronto para simplificar o planejamento de eventos?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 mb-10"
          >
            Cadastre-se gratuitamente e comece a conectar-se com os melhores profissionais para o seu evento ou anuncie seus espaços.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/register?type=contratante">
              <Button className="bg-white text-primary hover:bg-white/90 px-6 py-6 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group w-full sm:w-auto">
                Cadastrar como Contratante
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/register?type=prestador">
              <Button className="bg-accent text-white hover:bg-accent/90 px-6 py-6 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                Cadastrar como Prestador
              </Button>
            </Link>
            <Link to="/register?type=anunciante">
              <Button className="bg-secondary text-white hover:bg-secondary/90 px-6 py-6 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                Cadastrar como Anunciante
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
