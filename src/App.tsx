
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
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/events" element={<DashboardLayout><Events /></DashboardLayout>} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={<CreateEvent />} />
          <Route path="/chat" element={<DashboardLayout><Chat /></DashboardLayout>} />
          <Route path="/chat/:id" element={<DashboardLayout><Conversation /></DashboardLayout>} />
          <Route path="/conversation/:id" element={<DashboardLayout><Conversation /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="/help-center" element={<DashboardLayout><HelpCenter /></DashboardLayout>} />
          <Route path="/support" element={<DashboardLayout><Support /></DashboardLayout>} />
          <Route path="/plans" element={<DashboardLayout><Plans /></DashboardLayout>} />
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
