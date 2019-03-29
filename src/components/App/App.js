import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { I18nextProvider } from 'react-i18next';

import routes from '../../routes';
import ScrollToTop from '../shared/ScrollToTop/ScrollToTop';
import '../../stylesheets/Kmedia.scss';
import * as shapes from '../shapes';

class App extends Component {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    history: shapes.History.isRequired,
    initialI18nStore: PropTypes.object,
    initialLanguage: PropTypes.string,
  };

  static defaultProps = {
    initialI18nStore: null,
    initialLanguage: null,
  };

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
