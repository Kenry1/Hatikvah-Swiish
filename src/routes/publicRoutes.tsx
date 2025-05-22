import { RouteObject } from 'react-router-dom';
import Login from '@/components/auth/Login';
import NotFound from '@/pages/NotFound';
import One from '@/pages/One';

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
    path: '/1',
    element: <One />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
