import { ReduxRouter as ConnectedRouter } from "@lagunovsky/redux-react-router";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Provider } from "react-redux";

import { I18nextProvider } from "react-i18next";

import {
  AbTestingContext,
  ClientChroniclesContext,
  DeviceInfoContext,
  SessionInfoContext,
} from "../../helpers/app-contexts";
import { ChroniclesActions } from "../../helpers/clientChronicles";
import StyleShadowDOM from "../../pkg/StyleShadowDOM";
import InitKCEvents from "../../pkg/ksAdapter/InitKCEvents";
import "../../stylesheets/Kmedia.scss";
import Layout from "../Layout/Layout";
import PlayerContainer from "../Player/PlayerContainer";
import * as shapes from "../shapes";
import ScrollToTop from "../shared/ScrollToTop/ScrollToTop";

const App = (props) => {
  const [isShareTextEnabled, setEnableShareText] = useState(false);

  const { i18n, store, history, deviceInfo, clientChronicles, abTesting } = props;

  const sessionInfo = { enableShareText: { isShareTextEnabled, setEnableShareText } };

  const playerContainer = <PlayerContainer />;
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <InitKCEvents />
        <ClientChroniclesContext.Provider value={clientChronicles}>
          <AbTestingContext.Provider value={abTesting}>
            <DeviceInfoContext.Provider value={deviceInfo}>
              <StyleShadowDOM />
              <SessionInfoContext.Provider value={sessionInfo}>
                <ChroniclesActions />
                <ConnectedRouter history={history}>
                  <ScrollToTop />
                  <Layout playerContainer={playerContainer} />
                </ConnectedRouter>
              </SessionInfoContext.Provider>
            </DeviceInfoContext.Provider>
          </AbTestingContext.Provider>
        </ClientChroniclesContext.Provider>
      </Provider>
    </I18nextProvider>
  );
};

App.propTypes = {
  i18n: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  history: shapes.History.isRequired,
  deviceInfo: PropTypes.object.isRequired,
};

export default App;
