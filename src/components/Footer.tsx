
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-muted mt-20">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Evento<span className="text-secondary">+</span></span>
            </Link>
            <p className="mt-4 text-sm">
              Conectando contratantes a prestadores de serviços para eventos de forma rápida, segura e personalizada.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/service-providers" className="hover:text-primary transition-colors">Prestadores</Link>
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
                <Link to="/service-providers?category=buffet" className="hover:text-primary transition-colors">Buffet</Link>
              </li>
              <li>
                <Link to="/service-providers?category=dj" className="hover:text-primary transition-colors">DJ</Link>
              </li>
              <li>
                <Link to="/service-providers?category=fotografia" className="hover:text-primary transition-colors">Fotografia</Link>
              </li>
              <li>
                <Link to="/service-providers?category=decoracao" className="hover:text-primary transition-colors">Decoração</Link>
              </li>
              <li>
                <Link to="/service-providers?category=iluminacao" className="hover:text-primary transition-colors">Iluminação</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <p className="text-sm mb-2">contato@eventoplus.com</p>
            <p className="text-sm mb-4">+55 (11) 1234-5678</p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
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
