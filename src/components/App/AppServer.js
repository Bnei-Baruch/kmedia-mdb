import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { HelmetProvider } from "../shared/Helmets/helmetESM";
import App from "./App";

export const AppServer = (props) => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <App {...props} />
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};
