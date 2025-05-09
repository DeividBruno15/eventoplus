
import React from 'react';
import { Settings, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { NotificationsMenu } from './notifications/NotificationsMenu';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useBreakpoint } from '@/hooks/useBreakpoint';

export const MobileTopbar = () => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint('md');
  
  if (!isMobile) return null;
  
  return (
    <div className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-bold">Evento+</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationsMenu />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            aria-label="Configurações"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileTopbar;
