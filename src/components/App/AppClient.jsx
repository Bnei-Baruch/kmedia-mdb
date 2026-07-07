import { StrictMode } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { HelmetProvider } from '../shared/Helmets/helmetESM';
import App from './App';

export default function AppClient(props) {
  return (
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <App {...props} />
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
