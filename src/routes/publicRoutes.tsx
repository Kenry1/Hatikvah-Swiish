import { RouteObject } from 'react-router-dom';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

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
    path: '*',
    element: <NotFound />
  }
];
