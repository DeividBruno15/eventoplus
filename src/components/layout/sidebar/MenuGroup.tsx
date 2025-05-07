
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
    <SidebarMenu className="px-2">
      {items.map((item) => {
        // Consider exact path match or if it's a subpath
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
