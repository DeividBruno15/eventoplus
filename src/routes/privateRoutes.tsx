
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import CreateEvent from '@/pages/CreateEvent';
import ServiceProviders from '@/pages/ServiceProviders';
import ProviderProfile from '@/pages/ProviderProfile';
import RequestQuote from '@/pages/RequestQuote';
import Settings from '@/pages/Settings';
import DocsHome from '@/pages/Docs/DocsHome';
import GettingStarted from '@/pages/Docs/GettingStarted';
import Venues from '@/pages/Venues';
import CreateVenue from '@/pages/Venues/CreateVenue';
import VenueDetails from '@/pages/Venues/VenueDetails';
import EditVenue from '@/pages/Venues/EditVenue';
import ManageVenues from '@/pages/Venues/ManageVenues';
import ManageVenueDetails from '@/pages/Venues/ManageVenueDetails';
import PaymentSuccess from '@/pages/Venues/PaymentSuccess';
import Chat from '@/pages/Chat';
import Conversation from '@/pages/Conversation';
import HelpCenter from '@/pages/HelpCenter';
import Notifications from '@/pages/Notifications';
import Payments from '@/pages/Payments';
import Plans from '@/pages/Plans';
import Support from '@/pages/Support';
import WhatsAppAssistant from '@/pages/WhatsAppAssistant';
import PrivateRoute from '@/hooks/auth/PrivateRoute';
import DashboardLayout from '@/layouts/DashboardLayout';

export const privateRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: '/profile',
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: '/user-profile/:id',
        element: <UserProfile />
      },
      {
        path: '/events',
        element: <Events />
      },
      {
        path: '/events/:id',
        element: <EventDetail />
      },
      {
        path: '/events/create',
        element: <PrivateRoute><CreateEvent /></PrivateRoute>
      },
      {
        path: '/service-providers',
        element: <ServiceProviders />
      },
      {
        path: '/provider/:id',
        element: <ProviderProfile />
      },
      {
        path: '/request-quote',
        element: <PrivateRoute><RequestQuote /></PrivateRoute>
      },
      {
        path: '/settings',
        element: <PrivateRoute><Settings /></PrivateRoute>
      },
      {
        path: '/docs',
        element: <DocsHome />
      },
      {
        path: '/docs/getting-started',
        element: <GettingStarted />
      },
      {
        path: '/venues',
        element: <Venues />
      },
      {
        path: '/venues/create',
        element: <PrivateRoute><CreateVenue /></PrivateRoute>
      },
      {
        path: '/venues/:id',
        element: <VenueDetails />
      },
      {
        path: '/venues/edit/:id',
        element: <PrivateRoute><EditVenue /></PrivateRoute>
      },
      {
        path: '/venues/manage',
        element: <PrivateRoute><ManageVenues /></PrivateRoute>
      },
      {
        path: '/venues/manage/:id',
        element: <PrivateRoute><ManageVenueDetails /></PrivateRoute>
      },
      {
        path: '/venues/payment-success',
        element: <PaymentSuccess />
      },
      {
        path: '/chat',
        element: <PrivateRoute><Chat /></PrivateRoute>
      },
      {
        path: '/conversation/:id',
        element: <PrivateRoute><Conversation /></PrivateRoute>
      },
      {
        path: '/help-center',
        element: <HelpCenter />
      },
      {
        path: '/notifications',
        element: <PrivateRoute><Notifications /></PrivateRoute>
      },
      {
        path: '/payments',
        element: <PrivateRoute><Payments /></PrivateRoute>
      },
      {
        path: '/plans',
        element: <Plans />
      },
      {
        path: '/support',
        element: <Support />
      },
      {
        path: '/whatsapp-assistant',
        element: <PrivateRoute><WhatsAppAssistant /></PrivateRoute>
      }
    ]
  }
];
