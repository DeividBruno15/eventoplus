
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutHero = () => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Conectamos pessoas e serviços para eventos
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
        A Evento+ é a plataforma completa que facilita a organização de eventos, conectando 
        contratantes a prestadores de serviços qualificados e espaços para eventos, economizando tempo e dinheiro.
      </p>
    </div>
  );
};

export default AboutHero;
