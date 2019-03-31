import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router-dom';

import { getQuery, prefixWithLanguage, stringify } from '../../helpers/url';
import * as shapes from '../shapes';

/**
 * multiLanguageLinkCreator - an higher order component to create a link that allows navigating
 * while keeping the current active language in the url, or changing to a new language on navigation.
 *
 * The wrapped component will keep most of the react-router-dom Link interface, with the following changes:
 * - it adds a language prop to the wrapped component if you need to force a language to the specific route.
 * - the "to" prop is not required like react-router-dom Link does, instead, if it is not supplied it will use the current location.
 *
 * There is a priority for how the active language after navigation is chosen (in descending order):
 * 1. the "language" prop
 * 2. the "to" prop contains a pathname that starts with a language's shorthand, for example: /ru/<Rest of url>,
 * 3. the current pathname's language shorthand if it exists in the pathname
 *
 * If you want to change the language, it is preferred to use the "language" prop instead of prefixing the pathname in the to prop.
 * i.e - use <Component to="/some-path" language="ru" /> instead of <Component to="/ru/some-path" />
 */

const multiLanguageLinkCreator = () => (WrappedComponent) => {
  class MultiLanguageLinkHOC extends Component {
    static propTypes = {
      to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
      location: shapes.HistoryLocation.isRequired,
      language: PropTypes.string, // language shorthand, for example: "ru"
      contentLanguage: PropTypes.string, // language shorthand, for example: "ru"
    };

    static defaultProps = {
      language: '',
      to: undefined,
      contentLanguage: undefined,
    };

    prefixPath = (path) => {
      const { location, language } = this.props;
      return prefixWithLanguage(path, location, language);
    };

    render() {
      // We need to use "unused constants" in order to get proper "rest"
      const { to, language, contentLanguage, location, match, history, staticContext, ...rest } = this.props;
      let navigateTo                                                                            = to;
      let toWithLanguage;

      if (typeof navigateTo === 'string') {
        toWithLanguage = this.prefixPath(navigateTo);
      } else {
        if (!navigateTo) {
          // we're changing 'search' in case contentLanguage was supplied
          navigateTo = { ...location };
        }

        if (contentLanguage !== undefined) {
          const q           = getQuery(navigateTo);
          q.language        = contentLanguage;
          navigateTo.search = `?${stringify(q)}`;
        }

        toWithLanguage = {
          ...navigateTo,
          pathname: this.prefixPath(navigateTo.pathname)
        };
      }

      return <WrappedComponent to={toWithLanguage} {...rest} />;
    }
  }

  return withRouter(hoistStatics(MultiLanguageLinkHOC, WrappedComponent));
};

export default multiLanguageLinkCreator;
