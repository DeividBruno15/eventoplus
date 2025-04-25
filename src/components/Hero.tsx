
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-20">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 space-y-6 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simplifique seu evento com a <span className="text-primary">Evento</span>
              <span className="text-secondary">+</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Conectamos você aos melhores prestadores de serviços para o seu evento, 
              de forma rápida e personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="bg-primary text-white hover:bg-primary/90 px-6 py-6 text-base">
                  Começar agora
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-secondary/20 rounded-full -z-10"></div>
              <img 
                src="/placeholder.svg" 
                alt="Evento+ Platform" 
                className="rounded-lg shadow-xl w-full object-cover h-80 md:h-96"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

