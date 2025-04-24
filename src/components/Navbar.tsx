
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, user, logout, loading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!user) return "?";
    
    // Tenta obter o nome dos metadados de usuário
    const firstName = user.user_metadata?.first_name as string | undefined;
    const lastName = user.user_metadata?.last_name as string | undefined;
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
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
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Dashboard</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-10 w-10 bg-primary text-primary-foreground">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} disabled={loading} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button variant="default" className="bg-primary text-white hover:bg-primary/90">Cadastrar</Button>
              </Link>
            </>
          )}
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
              {session ? (
                <>
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full border-primary text-primary">Dashboard</Button>
                  </Link>
                  <Link to="/profile" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full border-primary text-primary">Entrar</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button variant="default" className="w-full bg-primary text-white">Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
