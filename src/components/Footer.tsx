
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-muted mt-20">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/da4d2305-aa9f-41b9-962b-9a5911539ac0.png" alt="Evento+" className="h-8" />
            </Link>
            <p className="mt-4 text-sm">
              Conectando contratantes, prestadores de serviços e anunciantes de espaços para eventos de forma rápida, segura e personalizada.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">Sobre</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contato</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/venues" className="hover:text-primary transition-colors">Locais para eventos</Link>
              </li>
              <li>
                <Link to="/contractors" className="hover:text-primary transition-colors">Contratantes</Link>
              </li>
              <li>
                <Link to="/service-providers" className="hover:text-primary transition-colors">Prestadores</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <p className="text-sm mb-2">contato@eventoplus.com</p>
            <p className="text-sm mb-4">+55 (11) 1234-5678</p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-muted mt-8 pt-8 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Evento+ — Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
