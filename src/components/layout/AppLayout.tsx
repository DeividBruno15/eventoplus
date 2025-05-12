
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import MobileTopbar from './MobileTopbar';
import MobileNavigation from './MobileNavigation';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint('md');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Mobile topbar */}
      <MobileTopbar />
      
      {/* Main content */}
      <ScrollArea className="flex-1 pb-16 md:pb-0">
        {children}
      </ScrollArea>
      
      {/* Mobile navigation */}
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default AppLayout;
