
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { useSession } from "@/contexts/SessionContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout() {
  const { session } = useSession();
  const isMobile = useIsMobile();
  const [activePath, setActivePath] = useState("/dashboard");
  const location = useLocation();

  const isEventsPage = location.pathname.startsWith('/events');

  if (!session) {
    return null; // Handled by route protection
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="px-6 py-3 h-16 flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              Evento<span className="text-secondary">+</span>
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNavigation activePath={activePath} onNavigate={setActivePath} />
          </SidebarContent>
          <SidebarFooter>
            <div className="px-3 py-2">
              <span className="text-xs text-muted-foreground block text-center">
                © {new Date().getFullYear()} Evento+
              </span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
            <div>
              {/* Welcome message */}
              {!isMobile && (
                <div>
                  <h3 className="font-medium">
                    Olá, {session.user?.user_metadata?.first_name || "Usuário"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Bem-vindo(a) de volta
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <NotificationsMenu />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 bg-slate-50 overflow-auto">
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
