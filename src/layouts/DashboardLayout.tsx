
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationTrigger } from "@/components/layout/notifications/NotificationTrigger";
import { NotificationsMenu } from "@/components/layout/notifications/NotificationsMenu";
import { SkipToContent } from "@/components/SkipToContent";
import { SEO } from "@/components/SEO";
import { ReactNode } from "react";

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
        <div className="flex min-h-svh w-full">
          <Sidebar>
            <div className="pb-12">
              <div className="flex flex-col">
                <div className="h-14 flex items-center justify-between px-4 pt-1">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-xl font-bold">
                    EventConnect
                  </div>
                  <div className="flex items-center gap-2">
                    <NotificationsMenu unreadCount={0} />
                    <UserMenu />
                  </div>
                </div>

                <SidebarNavigation onNavigate={() => {}} />
              </div>
            </div>
          </Sidebar>

          <div className="flex-1 p-6 lg:px-8">
            <main id="main-content" className="outline-none">
              {content}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
