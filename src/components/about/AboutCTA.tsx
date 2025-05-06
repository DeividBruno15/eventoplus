
import { Link } from 'react-router-dom';

const AboutCTA = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl py-12 px-8 text-center text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Pronto para transformar seus eventos?
      </h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Junte-se a milhares de contratantes, prestadores de serviço e anunciantes que estão revolucionando o mercado de eventos.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/register" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Criar uma conta
        </Link>
        <Link to="/service-providers" className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
          Explorar serviços
        </Link>
        <Link to="/venues" className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/80 transition-colors">
          Ver espaços
        </Link>
      </div>
    </div>
  );
};

export default AboutCTA;
