
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Fechar o menu móvel quando mudar de página
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso."
      });
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair da sua conta.",
        variant: "destructive"
      });
    }
    setIsMenuOpen(false);
  };

  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-bold text-primary">Evento<span className="text-secondary">+</span></span>
        </Link>

        {/* Centralized Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors text-sm lg:text-base">Home</Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors text-sm lg:text-base">Sobre</Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors text-sm lg:text-base">Contato</Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/5"
                  size="sm" 
                >
                  Dashboard
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8 md:h-10 md:w-10 border border-gray-200">
                    {avatarUrl ? (
                      <AvatarImage 
                        src={avatarUrl} 
                        alt={`${firstName} ${lastName}`} 
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    )}
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:bg-primary/5"
                  size="sm" 
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">Cadastrar</Button>
              </Link>
            </div>
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
        <div className="md:hidden bg-white shadow-md fixed inset-x-0 top-[52px] z-50 py-4 animate-fade-in min-h-[100vh]">
          <div className="px-4 flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-primary transition-colors py-2" onClick={toggleMenu}>Home</Link>
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
                    className="w-full flex items-center justify-center gap-2 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="ghost" className="w-full text-primary">Entrar</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button variant="default" className="w-full">Cadastrar</Button>
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
