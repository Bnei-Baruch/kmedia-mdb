import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { I18nextProvider } from 'react-i18next';

import routes from '../../routes';
import ScrollToTop from '../shared/ScrollToTop/ScrollToTop';
import '../../stylesheets/Kmedia.scss';
import * as shapes from '../shapes';
import { DeviceInfoContext } from '../../helpers/app-contexts'

const App = (props) => {
  const { i18n, store, history, initialI18nStore, initialLanguage, deviceInfo } = props;
  const deviceInfoContext =  {
    deviceInfo: deviceInfo,
    isMobileDevice: deviceInfo.device && deviceInfo.device.type === 'mobile',
    autoPlayAllowed: deviceInfo.device.type === undefined
  };
  return (
    <I18nextProvider i18n={i18n} initialI18nStore={initialI18nStore} initialLanguage={initialLanguage}>
      <Provider store={store}>
        <DeviceInfoContext.Provider value={deviceInfoContext}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              {renderRoutes(routes)}
            </ScrollToTop>
          </ConnectedRouter>
        </DeviceInfoContext.Provider>
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
