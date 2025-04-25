import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Calendar, CheckCircle, Star, Users } from 'lucide-react';

const statData = [
  { number: "1000+", label: "Eventos realizados", icon: Calendar },
  { number: "500+", label: "Profissionais", icon: Users },
  { number: "98%", label: "Clientes satisfeitos", icon: Star },
];

const featuresData = [
  "Conecte-se a mais de 500 profissionais em todo o Brasil",
  "Compare propostas e preços de diferentes prestadores",
  "Chat integrado para comunicação direta e segura",
  "Avaliações verificadas de clientes anteriores"
];

const messageAnimations = [
  "Preciso de um fotógrafo para meu casamento!",
  "Procuro um buffet para evento corporativo",
  "Alguém indica DJ para festa?",
  "Busco decorador para aniversário"
];

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-primary/3 rounded-full -top-40 -right-40 blur-3xl" />
        <div className="absolute w-[600px] h-[600px] bg-accent/3 rounded-full -bottom-32 -left-32 blur-3xl" />
        <div className="hidden lg:block absolute top-1/4 left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div className="hidden lg:block absolute bottom-1/4 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary mb-6 border border-primary/10"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">A plataforma de serviços para eventos</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary"
            >
              Conectamos sonhos a realidade
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              A plataforma que une os melhores profissionais de eventos aos seus projetos especiais. 
              Transforme sua visão em realidade com nossa rede de especialistas.
            </motion.p>
            
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mb-8"
            >
              {featuresData.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  className="flex items-center gap-2 mb-2 text-gray-700"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/register?type=contratante">
                <Button size="lg" className="group text-lg gap-2 relative overflow-hidden">
                  <span className="relative z-10">Comece seu evento</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                </Button>
              </Link>
              <Link to="/register?type=prestador">
                <Button variant="outline" size="lg" className="text-lg border-2">
                  Seja um prestador
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex-1 w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 flex flex-col gap-4 justify-center">
                <AnimatePresence>
                  {messageAnimations.map((message, index) => (
                    <motion.div
                      key={message}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card className="w-full max-w-md shadow-lg border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Star className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-gray-700">{message}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {statData.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative z-10">
                <div className="p-3 rounded-full bg-primary/5 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl transform rotate-3 z-0"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
