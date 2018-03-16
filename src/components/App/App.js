import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { I18nextProvider } from 'react-i18next';

import { DEFAULT_LANGUAGE } from '../../helpers/consts';
import i18n from '../../helpers/i18nnext';
import { selectors as system } from '../../redux/modules/system';
import MultiLanguageRouteProvider from '../Language/MultiLanguageRouteProvider';
import Routes from './Routes';
import '../../stylesheets/Kmedia.css';
import * as shapes from '../shapes';

const Loader = () => (
  <div id="app-loader">
    <h1>Loading...</h1>
  </div>
);

class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: shapes.History.isRequired,
    isAppReady: PropTypes.bool,
  };

  static defaultProps = {
    isAppReady: false,
  };

  render() {
    const { isAppReady, store, history } = this.props;

    if (isAppReady) {
      return (
        <div id="app">
          <I18nextProvider i18n={i18n} initialLanguage={DEFAULT_LANGUAGE}>
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <MultiLanguageRouteProvider>
                  <Routes />
                </MultiLanguageRouteProvider>
              </ConnectedRouter>
            </Provider>
          </I18nextProvider>
        </div>
      );
    }

    return <Loader />;
  }
}

export default connect(
  state => ({ isAppReady: system.isReady(state.system) })
)(App);
