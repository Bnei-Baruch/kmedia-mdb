import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { HelmetProvider } from '../shared/Helmets/helmetESM';
import App from './App';

export const AppServer = ({ helmetContext, ...props }) => (
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider context={helmetContext}>
        <App {...props} />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
