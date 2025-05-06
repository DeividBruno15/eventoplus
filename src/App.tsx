
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import RequestQuote from "./pages/RequestQuote";
import ServiceProviders from "./pages/ServiceProviders";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import DashboardLayout from "./layouts/DashboardLayout";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import ProviderProfile from "./pages/ProviderProfile";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Conversation from "./pages/Conversation";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./hooks/auth/AuthProvider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { DeleteSpecificEvent } from "./pages/DeleteSpecificEvent";
import VenuesPage from "./pages/Venues";
import CreateVenuePage from "./pages/Venues/CreateVenue";
import VenueDetailsPage from "./pages/Venues/VenueDetails";
import EditVenuePage from "./pages/Venues/EditVenue";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/request-quote" element={<RequestQuote />} />
                <Route path="/service-providers" element={<ServiceProviders />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/providers/:id" element={<ProviderProfile />} />
                <Route path="/onboarding" element={<Onboarding />} />

                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="/" element={<DashboardLayout />}>
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events/:id/edit" element={<CreateEvent />} />
                  <Route path="events/:id/delete" element={<DeleteSpecificEvent />} />
                  
                  <Route path="venues" element={<VenuesPage />} />
                  <Route path="venues/create" element={<CreateVenuePage />} />
                  <Route path="venues/details/:id" element={<VenueDetailsPage />} />
                  <Route path="venues/edit/:id" element={<EditVenuePage />} />

                  <Route path="chat" element={<Chat />} />
                  <Route path="chat/:conversationId" element={<Conversation />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
