import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LanguageRouter from './LanguageRouters';
import useRoutes from './routes';

const KmediaRouters = ({ playerContainer }) => {
  const routes = useRoutes(playerContainer);
  return (
    <Routes>
      <Route path="/:lang" key="route_language" element={<LanguageRouter />}>
        {
          routes.map(({ path, component }) => <Route element={component} path={path} key={`route_${path}`} />)
        }
      </Route>
    </Routes>
  );
};

export default KmediaRouters;
