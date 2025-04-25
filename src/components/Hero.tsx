
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-indigo-50/80 to-white">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full -top-32 -left-32 blur-3xl" />
        <div className="absolute w-[400px] h-[400px] bg-secondary/5 rounded-full -bottom-20 -right-20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Conteúdo principal */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Conectamos sonhos a realidade
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              A plataforma que une os melhores profissionais de eventos aos seus projetos especiais. 
              Transforme sua visão em realidade com nossa rede de especialistas.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/register?type=contratante">
                <Button className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                  Comece seu evento
                </Button>
              </Link>
              <Link to="/register?type=prestador">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-primary/5 transition-all">
                  Seja um prestador
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Imagem ilustrativa */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 shadow-2xl">
                <img
                  src="/hero-image.jpg"
                  alt="Eventos memoráveis"
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>

        {/* Estatísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center"
        >
          {[
            { number: "1000+", label: "Eventos realizados" },
            { number: "500+", label: "Profissionais" },
            { number: "50+", label: "Cidades" },
            { number: "98%", label: "Clientes satisfeitos" }
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-3xl font-bold text-primary mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
