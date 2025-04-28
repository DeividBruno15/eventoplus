
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import Chat from "./pages/Chat";
import Conversation from "./pages/Conversation";
import Settings from "./pages/Settings";
import Plans from "./pages/Plans";
import Onboarding from "./pages/Onboarding";
import ServiceProviders from "./pages/ServiceProviders";
import ProviderProfile from "./pages/ProviderProfile";
import RequestQuote from "./pages/RequestQuote";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import HelpCenter from "./pages/HelpCenter";
import Support from "./pages/Support";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/sonner";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Dashboard routes nested under DashboardLayout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="events" element={<Events />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<Conversation />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="support" element={<Support />} />
            <Route path="plans" element={<Plans />} />
          </Route>
          
          {/* Routes that should show DashboardLayout */}
          <Route path="/events/create" element={
            <SidebarProvider>
              <DashboardLayout>
                <CreateEvent />
              </DashboardLayout>
            </SidebarProvider>
          } />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={<CreateEvent />} />
          <Route path="/service-providers" element={<ServiceProviders />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/request-quote/:id?" element={<RequestQuote />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
