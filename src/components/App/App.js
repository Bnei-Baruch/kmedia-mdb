import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ReduxRouter as ConnectedRouter } from '@lagunovsky/redux-react-router';

import { I18nextProvider } from 'react-i18next';

import ScrollToTop from '../shared/ScrollToTop/ScrollToTop';
import '../../stylesheets/Kmedia.scss';
import * as shapes from '../shapes';
import { ChroniclesActions } from '../../helpers/clientChronicles';
import {
  AbTestingContext,
  ClientChroniclesContext,
  DeviceInfoContext,
  SessionInfoContext,
} from '../../helpers/app-contexts';
import InitKC from '../../pkg/ksAdapter/InitKC';
import Layout from '../Layout/Layout';

const App = props => {
  const [isShareTextEnabled, setEnableShareText] = useState(false);

  const {
          i18n,
          store,
          history,
          initialI18nStore,
          initialLanguage,
          deviceInfo,
          clientChronicles,
          abTesting
        } = props;

  const sessionInfo       = {
    enableShareText: { isShareTextEnabled, setEnableShareText }
  };
  const deviceInfoContext = {
    deviceInfo,
    isMobileDevice: deviceInfo.device?.type === 'mobile',
    undefinedDevice: deviceInfo.device?.type === undefined
  };

  return (
    <I18nextProvider i18n={i18n} initialI18nStore={initialI18nStore} initialLanguage={initialLanguage}>
      <Provider store={store}>
        <InitKC />
        <ClientChroniclesContext.Provider value={clientChronicles}>
          <AbTestingContext.Provider value={abTesting}>
            <DeviceInfoContext.Provider value={deviceInfoContext}>
              <SessionInfoContext.Provider value={sessionInfo}>
                <ChroniclesActions />
                <ConnectedRouter history={history}>
                  <ScrollToTop>
                    <Layout />
                  </ScrollToTop>
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
  initialI18nStore: PropTypes.object,
  initialLanguage: PropTypes.string,
  deviceInfo: PropTypes.object.isRequired,
};

App.defaultProps = {
  initialI18nStore: null,
  initialLanguage: null,
};

export default App;
