
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom';
import { AppProviders } from './components/AppProviders';
import * as routes from './routes';

// Component to render all routes
const AppRoutes = () => {
  const allRoutes = [
    ...routes.publicRoutes,
    ...routes.technicianRoutes,
    ...routes.warehouseRoutes,
    ...routes.logisticsRoutes,
    ...routes.hrRoutes,
    ...routes.implementationManagerRoutes,
    ...routes.projectManagerRoutes,
    ...routes.planningRoutes,
    ...routes.itRoutes,
    ...routes.financeRoutes,
    ...routes.managementRoutes,
    ...routes.ehsRoutes,
    ...routes.procurementRoutes,
  ];
  
  // useRoutes hook doesn't work with the structure we've chosen
  // so we'll use Routes/Route pattern instead
  return (
    <Routes>
      {routes.publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.technicianRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.warehouseRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.logisticsRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.hrRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.implementationManagerRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.projectManagerRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.planningRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.itRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.financeRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.managementRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.ehsRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {routes.procurementRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

const App = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
