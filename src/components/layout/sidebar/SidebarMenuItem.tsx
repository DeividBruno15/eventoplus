
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SidebarMenuItem as UISidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { MenuItem } from './types';

type SidebarMenuItemProps = {
  item: MenuItem;
  isActive: boolean;
  onClick: (path: string) => void;
}

export const SidebarMenuItemComponent: React.FC<SidebarMenuItemProps> = ({ 
  item, 
  isActive, 
  onClick 
}) => {
  const Icon = item.icon;

  // Only show badge if it exists and is greater than 0
  const showBadge = item.badge && item.badge > 0;

  return (
    <UISidebarMenuItem className="transition-all duration-200 ease-in-out">
      <SidebarMenuButton
        aria-current={isActive ? 'page' : undefined}
        onClick={() => onClick(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
          isActive
            ? 'bg-primary/10 text-primary font-medium scale-105'
            : 'hover:bg-gray-50 text-gray-600 hover:text-primary hover:translate-x-1 dark:hover:bg-gray-800 dark:text-gray-300'
        }`}
      >
        <div className="flex items-center gap-3 w-full">
          <div className="relative">
            <Icon className={`h-5 w-5 transition-transform duration-300 ${
              isActive ? 'scale-110 text-primary' : 'text-gray-500 dark:text-gray-400'
            }`} />
            {showBadge && (
              <span className="absolute -top-1 -right-1">
                <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              </span>
            )}
          </div>
          <span className="truncate">{item.name}</span>
        </div>
      </SidebarMenuButton>
    </UISidebarMenuItem>
  );
};
