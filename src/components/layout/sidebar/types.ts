
export type MenuItem = {
  path: string;
  name: string;
  icon: React.ElementType;
  badge?: number;
}

export type SidebarNavigationProps = {
  activePath: string;
  onNavigate: (path: string) => void;
}
