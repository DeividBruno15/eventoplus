
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import PrivateRoute from '@/hooks/auth/PrivateRoute';
import { AuthProvider } from '@/hooks/auth/AuthProvider';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { SidebarProvider } from '@/components/ui/sidebar/context';
import AppLayout from '@/components/layout/AppLayout';
import ServicesPage from '@/pages/Services';
import ProvidersPage from '@/pages/Providers';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// Componente para controlar quando mostrar navbar e footer
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAppPage = location.pathname.startsWith('/dashboard') || 
                    location.pathname.startsWith('/events') ||
                    location.pathname.startsWith('/chat') ||
                    location.pathname.startsWith('/venues') ||
                    location.pathname.startsWith('/profile') ||
                    location.pathname.startsWith('/settings') ||
                    location.pathname.startsWith('/payments') ||
                    location.pathname.startsWith('/help-center') ||
                    location.pathname.startsWith('/support') ||
                    location.pathname.startsWith('/services') ||
                    location.pathname.startsWith('/providers');
  
  return isAppPage ? children : (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Verificar se já mostrou a splash screen nesta sessão
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      setShowSplash(false);
    } else {
      // Marcar que já mostrou a splash screen
      sessionStorage.setItem('splashShown', 'true');
      
      // Esconder splash após 3 segundos
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (showSplash) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="theme-preference">
        <SplashScreen />
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-preference">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              } />
              <Route path="/about" element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              } />
              <Route path="/contact" element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              } />
              <Route path="/login" element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } />
              <Route path="/register" element={
                <PageWrapper>
                  <Register />
                </PageWrapper>
              } />
              <Route path="/onboarding" element={
                <PageWrapper>
                  <Onboarding />
                </PageWrapper>
              } />
              
              {/* Páginas privadas com layout de app */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
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
                      {/* Component será substituído depois */}
                      <div className="container mx-auto p-6">
                        <h1 className="text-2xl font-bold">Suporte</h1>
                      </div>
                    </AppLayout>
                  </SidebarProvider>
                </PrivateRoute>
              } />
            </Routes>
          </Router>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
