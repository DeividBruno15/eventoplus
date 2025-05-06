
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary rounded-3xl overflow-hidden mx-4 md:mx-8 my-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary/80 z-[-1]"></div>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para transformar suas ideias em eventos incríveis?
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
          Junte-se à comunidade Evento+ e conecte-se com profissionais qualificados e espaços perfeitos para seus eventos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button 
              variant="secondary" 
              size="lg"
              className="px-8 py-6 h-auto text-lg font-medium bg-white text-primary hover:bg-white/90"
            >
              Cadastrar como Contratante
            </Button>
          </Link>
          <Link to="/service-providers">
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-6 h-auto text-lg font-medium border-white text-white hover:bg-white/20"
            >
              Ver prestadores de serviços
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
