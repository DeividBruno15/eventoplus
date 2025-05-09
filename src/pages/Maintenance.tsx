
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Maintenance = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-primary/5 flex flex-col">
      {/* Efeitos decorativos de background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
        {/* Ilustração */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 flex justify-center items-center"
        >
          <div className="relative">
            {/* Círculo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-md"></div>
            
            {/* SVG ilustrativo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="420"
              height="360"
              viewBox="0 0 600 400"
              fill="none"
              className="relative z-10"
            >
              <motion.path
                d="M288 152L300 136L312 152H288Z"
                fill="hsl(var(--primary))"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              />
              <motion.rect
                x="294"
                y="152"
                width="12"
                height="40"
                fill="hsl(var(--primary))"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.8 }}
              />
              <motion.circle
                cx="300"
                cy="220"
                r="60"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeDasharray="377"
                strokeDashoffset="377"
                fill="transparent"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
              />
              <motion.circle
                cx="300"
                cy="220"
                r="50"
                stroke="hsl(var(--secondary))"
                strokeWidth="4"
                fill="transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              />
              <motion.circle
                cx="300"
                cy="220"
                r="6"
                fill="hsl(var(--secondary))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 }}
              />

              {/* Engrenagens */}
              <motion.g
                animate={{ 
                  rotate: 360 
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ originX: "270px", originY: "180px" }}
              >
                <path
                  d="M270 150C284.64 150 296 161.36 296 176C296 190.64 284.64 202 270 202C255.36 202 244 190.64 244 176C244 161.36 255.36 150 270 150ZM270 158C259.77 158 252 165.77 252 176C252 186.23 259.77 194 270 194C280.23 194 288 186.23 288 176C288 165.77 280.23 158 270 158Z"
                  fill="hsl(var(--muted-foreground))"
                />
                <path
                  d="M270 136V146M252 142L258 150M241 158L250 162M238 176H248M241 194L250 190M252 210L258 202M270 216V206M288 210L282 202M300 194L290 190M302 176H292M300 158L290 162M288 142L282 150"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </motion.g>

              <motion.g
                animate={{ 
                  rotate: -360 
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ originX: "350px", originY: "240px" }}
              >
                <path
                  d="M350 215C361.05 215 370 223.95 370 235C370 246.05 361.05 255 350 255C338.95 255 330 246.05 330 235C330 223.95 338.95 215 350 215Z"
                  fill="hsl(var(--accent))"
                  fillOpacity="0.5"
                />
                <path
                  d="M350 205V211M338 208L342 214M330 219L336 222M328 231H334M330 245L336 241M338 254L342 248M350 259V253M362 254L359 248M370 245L364 241M372 231H366M370 219L364 222M362 208L359 214"
                  stroke="hsl(var(--accent))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* Laptop/tela estilizado */}
              <motion.path
                d="M200 260H400V320C400 325.52 395.52 330 390 330H210C204.48 330 200 325.52 200 320V260Z"
                fill="hsl(var(--secondary))"
                fillOpacity="0.2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              
              <motion.path
                d="M180 330H420V340C420 345.52 415.52 350 410 350H190C184.48 350 180 345.52 180 340V330Z"
                fill="hsl(var(--muted))"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
              
              {/* Código binário */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2 }}
              >
                <text x="220" y="280" fill="hsl(var(--primary))" fontSize="10">01001101 01100001 01101110 01110101</text>
                <text x="220" y="295" fill="hsl(var(--secondary))" fontSize="10">01110100 01100101 01101110 11000011</text>
                <text x="220" y="310" fill="hsl(var(--primary))" fontSize="10">11000111 11000011 01101111 01101111</text>
              </motion.g>
            </svg>
          </div>
        </motion.div>
        
        {/* Conteúdo de texto */}
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
      </div>
      
      <footer className="py-6 border-t border-border/40 backdrop-blur-sm bg-background/30 mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 EventoPlusConnect. Todos os direitos reservados.</p>
          <p>Agradecemos sua compreensão e paciência.</p>
        </div>
      </footer>
    </div>
  );
};

export default Maintenance;
