import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import LanguageSetter from '../Language/LanguageSetter';
import { DEFAULT_LANGUAGE } from '../../helpers/consts';

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
      <LanguageSetter language={DEFAULT_LANGUAGE}>
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
