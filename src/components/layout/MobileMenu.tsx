
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { session } = useAuth();
  
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Quem Somos', path: '/about' },
    { name: 'Prestadores', path: '/service-providers' },
    { name: 'Planos', path: '/plans' },
    { name: 'Ajuda', path: '/help-center' },
    { name: 'Contato', path: '/contact' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLinkClick = () => {
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold text-center">Menu</h2>
          </div>
          
          <div className="flex flex-col gap-1 py-6">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={handleLinkClick}
                className={`px-4 py-2.5 rounded-md ${
                  isActive(item.path) 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted transition-colors duration-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pb-6 pt-4 border-t">
            {session ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md text-center hover:bg-primary/90 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md text-center hover:bg-primary/90 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="w-full px-4 py-2 border rounded-md text-center hover:bg-muted transition-colors"
                >
                  Cadastre-se
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
