
import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PublicLayout } from './layouts/PublicLayout';

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/onboarding',
        element: <Onboarding />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      }
    ]
  }
];
