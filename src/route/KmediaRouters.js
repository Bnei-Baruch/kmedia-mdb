import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import HomePage from '../components/Sections/Home/HomePage';
import LanguageRouter from './LanguageRouters';

const KmediaRouters = () => (
  <Routes>
    <Route element={<HomePage />} index key="route_home_page" />
    <Route path="/:lang" key="route_language" element={<LanguageRouter />}>
      {
        routes.map(({ path, component }, i) => <Route element={component} path={path} key={`route_${i}`} />
        )
      }
    </Route>
  </Routes>
);

export default KmediaRouters;
