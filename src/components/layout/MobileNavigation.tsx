import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  MessageSquare, 
  User 
} from 'lucide-react';
import { getMainMenuItems } from './sidebar/menu-data';

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get the base menu items - always show Dashboard, Chat and Profile on mobile
  const baseItems = [
    { icon: LayoutDashboard, name: 'Início', path: '/dashboard' },
    { icon: MessageSquare, name: 'Chat', path: '/chat' },
    { icon: User, name: 'Perfil', path: '/profile' },
  ];
  
  // Get dynamic menu items based on user preferences
  const allMenuItems = getMainMenuItems(user);
  
  // Filter to keep only up to 5 items for mobile (including the base items)
  // Priority: Dashboard, dynamic items based on preferences, then Chat and Profile
  const dynamicItems = allMenuItems.filter(item => 
    !baseItems.some(baseItem => baseItem.path === item.path)
  );
  
  // Take only the first 2 dynamic items (to keep total at max 5 with the 3 base items)
  const limitedDynamicItems = dynamicItems.slice(0, 2);
  
  // Combine the base and dynamic items
  const navItems = [
    baseItems[0], // Dashboard first
    ...limitedDynamicItems,
    ...baseItems.slice(1) // Chat and Profile last
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center z-50">
      <div className="flex justify-around w-full px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-full"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-0.5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
