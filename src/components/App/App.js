import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { I18nextProvider } from 'react-i18next';

import routes from '../../routes';
import '../../stylesheets/Kmedia.css';

class App extends Component {
  render() {
    const { i18n, store, history } = this.props;
    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      </I18nextProvider>
    );
  }
}

export default App;
