
import React, { useState } from 'react';
import { Settings, Bell, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from '@/components/ui/use-toast';
import { NotificationsMenu } from './notifications/NotificationsMenu';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Badge } from "@/components/ui/badge";
import { useNotifications } from '@/hooks/useNotifications';
import { Skeleton } from '@/components/ui/skeleton';

export const MobileTopbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useBreakpoint('md');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { unreadCount, markAllAsRead, isLoading } = useNotifications();
  
  if (!isMobile) return null;
  
  const handleGoToSettings = () => {
    navigate('/settings');
    setIsSettingsOpen(false);
  };
  
  const handleGoToSection = (path: string, title: string) => {
    navigate(path);
    setIsSettingsOpen(false);
    toast({
      title: `Navegando para ${title}`,
      duration: 1500,
    });
  };
  
  return (
    <div className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-between px-3">
        <div>
          <h1 className="text-base font-bold">Evento+</h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          
          <div className="relative">
            <NotificationsMenu />
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Notificações${unreadCount ? ` (${unreadCount} não lidas)` : ''}`}
              className="relative h-8 w-8 p-0"
            >
              <Bell className="h-4 w-4" />
              {isLoading ? (
                <Skeleton className="absolute -top-1 -right-1 w-3 h-3 rounded-full" />
              ) : unreadCount > 0 ? (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 text-[8px]"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              ) : null}
            </Button>
          </div>
          
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Configurações"
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Configurações</SheetTitle>
              </SheetHeader>
              
              <div className="py-6 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-9" 
                  onClick={handleGoToSettings}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações da Conta
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-9" 
                  onClick={() => handleGoToSection('/payments', 'Assinaturas')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-2 h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Minha Assinatura
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-9"
                  onClick={() => handleGoToSection('/support', 'Suporte')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-2 h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Suporte
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-9"
                  onClick={() => handleGoToSection('/help-center', 'Central de Ajuda')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-2 h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Central de Ajuda
                </Button>
                
                <div className="pt-3 border-t mt-3">
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-sm h-9 text-destructive hover:text-destructive"
                    onClick={() => {
                      // Lógica de logout aqui
                      toast({
                        title: "Saindo...",
                        description: "Você será desconectado em breve.",
                      });
                      setIsSettingsOpen(false);
                      // Em um cenário real, aqui seria a função de logout
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="mr-2 h-4 w-4" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default MobileTopbar;
