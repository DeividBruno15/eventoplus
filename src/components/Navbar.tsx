
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Evento<span className="text-secondary">+</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/service-providers" className="font-medium hover:text-primary transition-colors">Prestadores</Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">Sobre</Link>
          <Link to="/contact" className="font-medium hover:text-primary transition-colors">Contato</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button variant="default" className="bg-primary text-white hover:bg-primary/90">Cadastrar</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full py-4 animate-fade-in">
          <div className="container mx-auto flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-primary transition-colors py-2" onClick={toggleMenu}>Home</Link>
            <Link to="/service-providers" className="font-medium hover:text-primary transition-colors py-2" onClick={toggleMenu}>Prestadores</Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors py-2" onClick={toggleMenu}>Sobre</Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors py-2" onClick={toggleMenu}>Contato</Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full border-primary text-primary">Entrar</Button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <Button variant="default" className="w-full bg-primary text-white">Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
