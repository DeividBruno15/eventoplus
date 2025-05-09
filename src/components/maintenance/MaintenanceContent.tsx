
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MaintenanceContent = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full md:w-1/2 space-y-8 text-center md:text-left"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10"
        >
          <Wrench className="h-8 w-8 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-br from-primary to-primary/70 text-transparent bg-clip-text">
          Estamos em manutenção
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-lg">
          Nossa equipe está trabalhando para aprimorar sua experiência. 
          O sistema estará de volta em breve com novidades.
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 max-w-md mx-auto md:mx-0"
      >
        <div className="flex items-start gap-2 mb-3">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
          <p className="text-muted-foreground">
            Estamos atualizando nossos sistemas para oferecer 
            uma experiência mais rápida, segura e eficiente para todos os usuários 
            da plataforma EventoPlusConnect.
          </p>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-secondary" />
            <p className="text-muted-foreground">
              Nossas equipes estão implementando novos recursos e melhorias 
              que solicitadas pelos usuários. Agradecemos sua compreensão.
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Button 
            variant="outline" 
            onClick={() => window.location.href = 'mailto:suporte@eventoplusconect.com'} 
            className="gap-2 group"
          >
            <AlertTriangle className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
            Precisa de ajuda? Entre em contato
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MaintenanceContent;
