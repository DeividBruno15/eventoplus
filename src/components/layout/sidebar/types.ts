
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type MenuItem = {
  name: string;
  icon: LucideIcon;
  path: string;
  roles?: string[];
  badge?: number;
  notificationKey?: string;
};

export type SidebarNavigationProps = {
  onNavigate: (path: string) => void;
};
