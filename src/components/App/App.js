import 'react-app-polyfill/ie11'; // For IE 11 support

import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { I18nextProvider } from 'react-i18next';

import routes from '../../routes';
import ScrollToTop from '../shared/ScrollToTop/ScrollToTop';
import '../../stylesheets/Kmedia.scss';

class App extends Component {
  render() {
    const { i18n, store, history, initialI18nStore, initialLanguage } = this.props;
    return (
      <I18nextProvider i18n={i18n} initialI18nStore={initialI18nStore} initialLanguage={initialLanguage}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              {renderRoutes(routes)}
            </ScrollToTop>
          </ConnectedRouter>
        </Provider>
      </I18nextProvider>
    );
  }
}

export default App;
