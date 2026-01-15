import React from 'react';
import { useSSR } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import { HelmetProvider } from '../shared/Helmets/helmetESM';

export default function AppClient(props) {
  const { i18nData, ...rest } = props;
  useSSR(i18nData);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <div>AppClient</div>
          {/*<App {...rest} />*/}
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
