
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/auth';

import Layout from './components/layout/Layout';
import Index from './pages/Index';
import About from './pages/About';
import ServiceProviders from './pages/ServiceProviders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import RequestQuote from './pages/RequestQuote';
import PrivateRoute from './hooks/auth/PrivateRoute';
import Contact from './pages/Contact/index';
import Settings from './pages/Settings';
import Maintenance from './pages/Maintenance';
import Venues from './pages/Venues';
import CreateVenue from './pages/Venues/CreateVenue';
import VenueDetails from './pages/Venues/VenueDetails';
import EditVenue from './pages/Venues/EditVenue';
import ManageVenues from './pages/Venues/ManageVenues';
import ManageVenueDetails from './pages/Venues/ManageVenueDetails';
import DocsHome from './pages/Docs/DocsHome';
import GettingStarted from './pages/Docs/GettingStarted';
import Chat from './pages/Chat';
import Conversation from './pages/Conversation';
import HelpCenter from './pages/HelpCenter';
import Notifications from './pages/Notifications';
import Payments from './pages/Payments';
import Plans from './pages/Plans';
import PaymentSuccess from './pages/Venues/PaymentSuccess';
import ProviderProfile from './pages/ProviderProfile';
import UserProfile from './pages/UserProfile';
import Support from './pages/Support';
import WhatsAppAssistant from './pages/WhatsAppAssistant';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  }
});

const isMaintenance = false;

// Component to wrap public pages with navbar and footer
const PublicPageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {isMaintenance ? (
                <>
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="*" element={<Navigate to="/maintenance" />} />
                </>
              ) : (
                <>
                  {/* Public routes with Navbar and Footer */}
                  <Route path="/" element={<PublicPageWrapper><Index /></PublicPageWrapper>} />
                  <Route path="/about" element={<PublicPageWrapper><About /></PublicPageWrapper>} />
                  <Route path="/contact" element={<PublicPageWrapper><Contact /></PublicPageWrapper>} />
                  <Route path="/login" element={<PublicPageWrapper><Login /></PublicPageWrapper>} />
                  <Route path="/onboarding" element={<PublicPageWrapper><Onboarding /></PublicPageWrapper>} />
                  <Route path="/register" element={<PublicPageWrapper><Register /></PublicPageWrapper>} />
                  <Route path="/forgot-password" element={<PublicPageWrapper><ForgotPassword /></PublicPageWrapper>} />
                  <Route path="/reset-password" element={<PublicPageWrapper><ResetPassword /></PublicPageWrapper>} />

                  {/* Private routes with Layout */}
                  <Route element={<Layout />}>
                    <Route 
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/user-profile/:id"
                      element={<UserProfile />}
                    />
                    <Route 
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/events"
                      element={<Events />}
                    />
                    <Route 
                      path="/events/:id"
                      element={<EventDetail />}
                    />
                    <Route 
                      path="/events/create"
                      element={
                        <PrivateRoute>
                          <CreateEvent />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/service-providers" element={<ServiceProviders />} />
                    <Route path="/provider/:id" element={<ProviderProfile />} />
                    <Route 
                      path="/request-quote"
                      element={
                        <PrivateRoute>
                          <RequestQuote />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/settings"
                      element={
                        <PrivateRoute>
                          <Settings />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/docs" element={<DocsHome />} />
                    <Route path="/docs/getting-started" element={<GettingStarted />} />
                    <Route 
                      path="/venues"
                      element={<Venues />}
                    />
                    <Route 
                      path="/venues/create"
                      element={
                        <PrivateRoute>
                          <CreateVenue />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/venues/:id" element={<VenueDetails />} />
                    <Route 
                      path="/venues/edit/:id"
                      element={
                        <PrivateRoute>
                          <EditVenue />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/venues/manage"
                      element={
                        <PrivateRoute>
                          <ManageVenues />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/venues/manage/:id"
                      element={
                        <PrivateRoute>
                          <ManageVenueDetails />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/venues/payment-success"
                      element={<PaymentSuccess />}
                    />
                    <Route 
                      path="/chat"
                      element={
                        <PrivateRoute>
                          <Chat />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/conversation/:id"
                      element={
                        <PrivateRoute>
                          <Conversation />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route 
                      path="/notifications"
                      element={
                        <PrivateRoute>
                          <Notifications />
                        </PrivateRoute>
                      }
                    />
                    <Route 
                      path="/payments"
                      element={
                        <PrivateRoute>
                          <Payments />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/support" element={<Support />} />
                    <Route 
                      path="/whatsapp-assistant"
                      element={
                        <PrivateRoute>
                          <WhatsAppAssistant />
                        </PrivateRoute>
                      }
                    />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </BrowserRouter>
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
