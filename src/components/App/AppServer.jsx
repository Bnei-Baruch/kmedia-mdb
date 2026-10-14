import { StrictMode } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { HelmetProvider } from '../shared/Helmets/helmetESM';
import App from './App';

export const AppServer = ({ helmetContext, ...props }) => (
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider context={helmetContext}>
        <App {...props} />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
