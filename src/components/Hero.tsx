
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Check, Star, Users, Calendar } from 'lucide-react';

const Hero = () => {
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center max-w-7xl">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
              Organize eventos,<br />
              encontre<br />
              <span className="text-primary">profissionais</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Conectamos contratantes, prestadores de serviços e anunciantes para criar eventos inesquecíveis. 
              Tudo em uma plataforma integrada e fácil de usar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button 
                size="lg"
                className="px-8 py-4 h-auto text-base font-medium bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                Começar agora
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 h-auto text-base font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                Saiba mais
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="text-green-600 h-4 w-4" />
              </div>
              <span className="text-sm text-gray-600">Profissionais verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="text-green-600 h-4 w-4" />
              </div>
              <span className="text-sm text-gray-600">Contratação simplificada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="text-green-600 h-4 w-4" />
              </div>
              <span className="text-sm text-gray-600">Comunicação direta</span>
            </div>
          </div>
        </div>

        {/* Right Animation/Visual */}
        <div className="relative flex justify-center items-center h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Conecte-se</h3>
                  <p className="text-sm text-gray-600">Com profissionais qualificados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Organize</h3>
                  <p className="text-sm text-gray-600">Eventos perfeitos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Avalie</h3>
                  <p className="text-sm text-gray-600">Sua experiência</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
