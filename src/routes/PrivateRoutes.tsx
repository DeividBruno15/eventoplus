
import { Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar/context';
import AppLayout from '@/components/layout/AppLayout';
import PrivateRoute from '@/hooks/auth/PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import ServicesPage from '@/pages/Services';
import ProvidersPage from '@/pages/Providers';

export const PrivateRoutes = () => {
  return (
    <>
      <Route path="/dashboard" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/events/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Eventos</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/venues/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Locais</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/providers/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <ProvidersPage />
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/services/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <ServicesPage />
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/chat/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Chat</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/profile/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Perfil</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/settings/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Configurações</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/payments/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Pagamentos</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/help-center/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Central de Ajuda</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
      
      <Route path="/support/*" element={
        <PrivateRoute>
          <SidebarProvider>
            <AppLayout>
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold">Suporte</h1>
              </div>
            </AppLayout>
          </SidebarProvider>
        </PrivateRoute>
      } />
    </>
  );
};
