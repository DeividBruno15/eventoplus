
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DashboardLayout from "./layouts/DashboardLayout";
import ServiceProviders from "./pages/ServiceProviders";
import ProviderProfile from "./pages/ProviderProfile";
import RequestQuote from "./pages/RequestQuote";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Chat from "./pages/Chat";
import Conversation from "./pages/Conversation";
import Plans from "./pages/Plans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plans" element={<Plans />} />
            
            {/* Rotas com o layout do dashboard */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/service-providers" element={<ServiceProviders />} />
              <Route path="/provider-profile/:id" element={<ProviderProfile />} />
              <Route path="/request-quote/:id" element={<RequestQuote />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<Conversation />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
