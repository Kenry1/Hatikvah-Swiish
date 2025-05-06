
import { RouteObject } from 'react-router-dom';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home'; 

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
