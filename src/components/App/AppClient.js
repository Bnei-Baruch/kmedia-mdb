import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { HelmetProvider } from '../shared/Helmets/helmetESM';
import App from './App';

const NAME_SPACE = 'AppClient';

export default function AppClient(props) {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <App {...props} />
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
