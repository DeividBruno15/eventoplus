
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const CallToAction = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80"></div>
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Pronto para transformar suas ideias em eventos incríveis?
        </h2>
        <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Junte-se à comunidade Evento+ e conecte-se com profissionais qualificados e espaços perfeitos para seus eventos.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <Link to="/register?role=contractor" className="flex-1">
            <Button 
              variant="secondary" 
              size="lg"
              className="w-full px-6 py-4 h-auto text-base font-medium bg-white text-primary hover:bg-white/90"
            >
              Cadastrar como Contratante
            </Button>
          </Link>
          <Link to="/register?role=provider" className="flex-1">
            <Button 
              variant="outline"
              size="lg"
              className="w-full px-6 py-4 h-auto text-base font-medium border-2 border-white text-white bg-transparent hover:bg-white/10"
            >
              Cadastrar como Prestador
            </Button>
          </Link>
          <Link to="/register?role=advertiser" className="flex-1">
            <Button 
              variant="outline"
              size="lg"
              className="w-full px-6 py-4 h-auto text-base font-medium border-2 border-white text-white bg-transparent hover:bg-white/10"
            >
              Anunciar Espaços
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
