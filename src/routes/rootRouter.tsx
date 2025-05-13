
import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';
import NotFound from '@/pages/NotFound';
import Maintenance from '@/pages/Maintenance';

// Check if maintenance mode is active
const isMaintenance = false;

// Define the maintenance routes
const maintenanceRoutes = [
  {
    path: '/maintenance',
    element: <Maintenance />
  },
  {
    path: '*',
    element: <Maintenance />
  }
];

// Create the router with conditional routes based on maintenance mode
export const router = createBrowserRouter(
  isMaintenance
    ? maintenanceRoutes
    : [
        ...publicRoutes,
        ...privateRoutes,
        {
          path: '*',
          element: <NotFound />
        }
      ]
);
