
import { RouteObject } from 'react-router-dom';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import WaitingApproval from '@/pages/WaitingApproval';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/waiting-approval',
    element: <WaitingApproval />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
