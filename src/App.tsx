
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
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/events" element={<Events />} />
            <Route path="/dashboard/chat" element={<Chat />} />
            <Route path="/dashboard/chat/:id" element={<Conversation />} />
            <Route path="/dashboard/conversation/:id" element={<Conversation />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/help-center" element={<HelpCenter />} />
            <Route path="/dashboard/support" element={<Support />} />
            <Route path="/dashboard/plans" element={<Plans />} />
          </Route>
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={<CreateEvent />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/service-providers" element={<ServiceProviders />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/request-quote/:id?" element={<RequestQuote />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
