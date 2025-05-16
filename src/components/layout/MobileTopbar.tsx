import React, { useState } from 'react';
import { Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { NotificationsMenu } from './notifications/NotificationsMenu';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAuth } from "@/hooks/auth";

export const MobileTopbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useBreakpoint('md');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { logout } = useAuth();
  
  // We're hiding this component completely since we're using bottom navigation
  return null;
};

export default MobileTopbar;
