
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type MenuItem = {
  name: string;
  icon: LucideIcon;
  path: string;
  label?: string; // Add this property
  roles?: string[];
  badge?: number;
  notificationKey?: string;
};

export type SidebarNavigationProps = {
  onNavigate: (path: string) => void;
};
