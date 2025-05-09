
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, Home, Book, FileText, HelpCircle, MessageSquare, Settings, Users } from 'lucide-react';

interface DocsLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DocsLayout = ({ children, title = "Documentação" }: DocsLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarItems = [
    { 
      title: "Início", 
      icon: <Home className="h-4 w-4" />,
      path: "/docs" 
    },
    { 
      title: "Guia de Início", 
      icon: <Book className="h-4 w-4" />,
      path: "/docs/getting-started" 
    },
    { 
      title: "Criação de Eventos", 
      icon: <FileText className="h-4 w-4" />,
      path: "/docs/creating-events" 
    },
    { 
      title: "Locais", 
      icon: <FileText className="h-4 w-4" />,
      path: "/docs/venues" 
    },
    { 
      title: "Prestadores", 
      icon: <Users className="h-4 w-4" />,
      path: "/docs/providers" 
    },
    { 
      title: "Configurações", 
      icon: <Settings className="h-4 w-4" />,
      path: "/docs/settings" 
    },
    { 
      title: "Chat", 
      icon: <MessageSquare className="h-4 w-4" />,
      path: "/docs/chat" 
    },
    { 
      title: "FAQ", 
      icon: <HelpCircle className="h-4 w-4" />,
      path: "/docs/faq" 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background sticky top-0 z-30">
        <div className="container flex h-14 items-center px-4 sm:px-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <h1 className="font-medium text-lg">
              {title}
            </h1>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/support')}
              className="hidden sm:flex"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Suporte
            </Button>
          </div>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden md:block border-r">
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="py-6 px-4 space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.path}
                  variant={currentPath === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    currentPath === item.path ? "font-medium" : "font-normal"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
