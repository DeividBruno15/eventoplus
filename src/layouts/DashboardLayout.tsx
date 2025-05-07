
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationsMenu } from "@/components/layout/notifications/NotificationsMenu";
import { SkipToContent } from "@/components/SkipToContent";
import { SEO } from "@/components/SEO";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const content = children || <Outlet />;

  return (
    <>
      <SEO title="Dashboard" />
      <SkipToContent />
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar>
            <SidebarContent>
              <div className="h-full flex flex-col">
                <div className="h-14 flex items-center justify-between px-4 pt-1">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-xl font-bold">
                    EventConnect
                  </div>
                </div>

                <SidebarNavigation onNavigate={() => {}} />
              </div>
            </SidebarContent>
          </Sidebar>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="h-14 border-b flex items-center justify-end px-4">
              <div className="flex items-center gap-2">
                <NotificationsMenu unreadCount={0} />
                <UserMenu />
              </div>
            </header>
            
            <main id="main-content" className="flex-1 overflow-auto p-6 lg:px-8 outline-none">
              {content}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
