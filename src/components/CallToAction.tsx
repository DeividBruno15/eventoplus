
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-indigo-700 z-[-1]"></div>
      
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
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Pronto para simplificar o planejamento do seu evento?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Cadastre-se gratuitamente e comece a conectar-se com os melhores profissionais para o seu evento.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register?type=contratante">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Cadastrar como Contratante
              </Button>
            </Link>
            <Link to="/register?type=prestador">
              <Button className="bg-accent text-white hover:bg-accent/90 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Cadastrar como Prestador
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
