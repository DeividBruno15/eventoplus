
import React from 'react';
import { SidebarMenu } from '@/components/ui/sidebar';
import { SidebarMenuItemComponent } from './SidebarMenuItem';
import { MenuItem } from './types';

type MenuGroupProps = {
  items: MenuItem[];
  activePath: string;
  onItemClick: (path: string) => void;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ items, activePath, onItemClick }) => {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = 
          activePath === item.path || 
          (item.path !== '/dashboard' && activePath.startsWith(item.path));
        
        return (
          <SidebarMenuItemComponent 
            key={item.path}
            item={item}
            isActive={isActive}
            onClick={onItemClick}
          />
        );
      })}
    </SidebarMenu>
  );
};
