
import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import DashboardLayout from './layouts/DashboardLayout';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import ServiceProviders from './pages/ServiceProviders';
import ProviderProfile from './pages/ProviderProfile';
import Plans from './pages/Plans';
import Onboarding from './pages/Onboarding';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import Events from './pages/Events';
import RequestQuote from './pages/RequestQuote';
import Conversation from './pages/Conversation';
import { SessionProvider } from './contexts/SessionContext';

function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="service-providers" element={<ServiceProviders />} />
          <Route path="provider/:id" element={<ProviderProfile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<Conversation />} />
          <Route path="plans" element={<Plans />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="request-quote" element={<RequestQuote />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </SessionProvider>
  );
}

export default App;
