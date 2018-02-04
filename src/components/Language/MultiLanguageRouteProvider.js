import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import LanguageSetter from '../Language/LanguageSetter';
import { DEFAULT_LANGUAGE } from '../../helpers/consts';
import { initialLng } from '../../helpers/i18n-utils';

/**
 * Automatically sets the appropriate language if the url's pathname starts with /<LANGUAGE>/
 * (where <LANGUAGE> is the language's shorthand. for example, for russian use /ru/<rest of url>).
 * It will set the default language if there is no language prefix in the pathname.
 *
 * You should wrap all routes that should be aware of the current language with this component.
 */

const MultiLanguageRouteProvider = ({ children }) => (
  <Switch>
    <Route
      path="/:language([a-z]{2})"
      render={({ match }) => (
        <LanguageSetter language={match.params.language}>
          { children }
        </LanguageSetter>
      )}
    />
    <Route render={() => (
      <LanguageSetter language={initialLng()}>
        { children }
      </LanguageSetter>
      )
    }
    />
  </Switch>
);

MultiLanguageRouteProvider.propTypes = {
  children: PropTypes.any.isRequired
};

export default MultiLanguageRouteProvider;
